// #region imports
    // #region libraries
    import fetch from 'cross-fetch';

    import mailer from 'nodemailer';
    // #endregion libraries


    // #region external
    import {
        logLevels,
        logLevelsText,
    } from '#server/data/constants';

    import {
        LoggedRecord,
        Notifier as INotifier,
        NotifierAPI,
        NotifierEmail,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
class Notifier {
    private log: LoggedRecord;

    constructor(
        log: LoggedRecord,
    ) {
        this.log = log;
    }

    public async notify() {
        const notifiers: INotifier[] = await database.query(
            'notifiers',
            'ownedBy',
            this.log.ownedBy,
        );

        if (notifiers.length === 0) {
            return;
        }

        for (const notifier of notifiers) {
            for (const notification of notifier.notifyOn) {
                switch (notification) {
                    case 'ENTITY_DEREGISTRATION':
                        break;
                    case 'ENTITY_REGISTRATION':
                        break;
                    case 'RECORDED_ERROR':
                        if (this.log.level === logLevels.error) {
                            this.handleNotifier(notifier);
                        }
                        break;
                    case 'RECORDED_FATAL':
                        if (this.log.level === logLevels.fatal) {
                            this.handleNotifier(notifier);
                        }
                        break;
                    case 'RECORDED_WARN':
                        if (this.log.level === logLevels.warn) {
                            this.handleNotifier(notifier);
                        }
                        break;
                    case 'TEST_FAIL':
                        break;
                    case 'TEST_SUCCESS':
                        break;
                }
            }
        }
    }


    private handleNotifier(
        notifier: INotifier,
    ) {
        switch (notifier.type) {
            case 'api':
                this.notifyAPI(notifier);
                break;
            case 'email':
                this.notifyEmail(notifier);
                break;
        }
    }

    private async notifyAPI(
        notifier: NotifierAPI,
    ) {
        const {
            data,
        } = notifier;

        const {
            endpoint,
            secret,
        } = data;

        const notifyData = {
            ...this.log,
        };
        delete (notifyData as any).ownedBy;

        await fetch(endpoint, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Delog-Secret': secret,
            },
            body: JSON.stringify({
                ...notifyData,
            }),
        });
    }

    private async notifyEmail(
        notifier: NotifierEmail,
    ) {
        try {
            const {
                data,
            } = notifier;

            const {
                host,
                port,
                secure,
                username,
                password,
                sender,
            } = data.authentication;

            const transporter = mailer.createTransport({
                host,
                port,
                secure,
                auth: {
                    user: username,
                    pass: password,
                },
            });

            const to = data.notifyTo.join(', ');

            const logLevelString = logLevelsText[this.log.level];
            const projectString = this.log.project ? ` - ${this.log.project}` : '';
            const subject = `delog :: ${logLevelString}` + projectString;


            const notifyData = {
                ...this.log,
            };
            delete (notifyData as any).ownedBy;

            const text = JSON.stringify(notifyData, null, 4);
            const html = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');

                body {
                    font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Open Sans', 'Helvetica Neue', sans-serif;
                    padding: 2rem;
                }

                h1 {
                    font-size: 2rem;
                }

                ul li {
                    margin-bottom: 0.5rem;
                }
            </style>

            <h1>
                delog :: ${logLevelString} ${projectString}
            </h1>

            <div>
                <ul>
                    ${notifyData.project
                        ? `
                            <li>
                                project: ${notifyData.project}
                            </li>
                        ` : ''
                    }

                    ${notifyData.space
                        ? `
                            <li>
                                space: ${notifyData.space}
                            </li>
                        ` : ''
                    }

                    ${notifyData.method
                        ? `
                            <li>
                                method: ${notifyData.method}
                            </li>
                        ` : ''
                    }

                    <li>
                        level: ${logLevelString} (${notifyData.level})
                    </li>

                    <li>
                        time: ${new Date(notifyData.time * 1000).toLocaleString()} (${notifyData.time})
                    </li>

                    <li>
                        text: ${notifyData.text}
                    </li>

                    ${notifyData.extradata
                        ? `
                            <li>
                                extradata: ${notifyData.extradata}
                            </li>
                        ` : ''
                    }

                    <li>
                        format: ${notifyData.format}
                    </li>

                    <li>
                        log: ${notifyData.log}
                    </li>
                </ul>
            </div>
            `;

            await transporter.sendMail({
                from: sender,
                to,
                subject,
                text,
                html,
            });
        } catch (error) {
            return;
        }
    }
}
// #endregion module



// #region exports
export default Notifier;
// #endregion exports
