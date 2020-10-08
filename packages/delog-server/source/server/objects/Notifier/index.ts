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

        NotificationEvent,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
class Notifier {
    private event: NotificationEvent;

    constructor(
        event: NotificationEvent,
    ) {
        this.event = event;
    }

    public async notify() {
        if (this.event.type === 'record') {
            const log = this.event.data;

            const notifiers: INotifier[] = await database.query(
                'notifiers',
                'ownedBy',
                log.ownedBy,
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
                            if (log.level === logLevels.error) {
                                this.handleNotifier(
                                    notifier,
                                    log,
                                );
                            }
                            break;
                        case 'RECORDED_FATAL':
                            if (log.level === logLevels.fatal) {
                                this.handleNotifier(
                                    notifier,
                                    log,
                                );
                            }
                            break;
                        case 'RECORDED_WARN':
                            if (log.level === logLevels.warn) {
                                this.handleNotifier(
                                    notifier,
                                    log,
                                );
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
    }


    private handleNotifier(
        notifier: INotifier,
        log: LoggedRecord,
    ) {
        switch (notifier.type) {
            case 'api':
                this.notifyAPI(
                    notifier,
                    log,
                );
                break;
            case 'email':
                this.notifyEmail(
                    notifier,
                    log,
                );
                break;
        }
    }

    private async notifyAPI(
        notifier: NotifierAPI,
        log: LoggedRecord,
    ) {
        const {
            data,
        } = notifier;

        const {
            endpoint,
            secret,
        } = data;

        const notifyData = {
            ...log,
        };
        delete (notifyData as any).ownedBy;
        delete (notifyData as any)._id;

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
        log: LoggedRecord,
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

            const logLevelString = logLevelsText[log.level];
            const projectString = log.project ? ` - ${log.project}` : '';
            const subject = `delog :: ${logLevelString}` + projectString;


            const notifyData = {
                ...log,
            };
            delete (notifyData as any).ownedBy;
            delete (notifyData as any)._id;

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
