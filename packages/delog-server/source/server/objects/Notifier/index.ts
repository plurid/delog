// #region imports
    // #region external
    import {
        logLevels,
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

    }

    private async notifyEmail(
        notifier: NotifierEmail,
    ) {
        const {
            data,
        } = notifier;

    }
}
// #endregion module



// #region exports
export default Notifier;
// #endregion exports
