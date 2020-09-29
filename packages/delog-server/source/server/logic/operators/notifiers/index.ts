// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        ClientNotifier,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerNotifier = async (
    value: ClientNotifier,
    ownedBy: string,
) => {
    const id = uuid.generate();

    const notifier: any = {
        ...value,
        id,
        ownedBy,
    };

    await database.store(
        'notifiers',
        id,
        notifier,
    );

    return notifier;
}


const deregisterNotifier = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'notifiers',
            id,
        );
    } catch (error) {
        return;
    }
}


const extractClientNotifierData = (
    type: any,
    data: any,
) => {
    switch (type) {
        case 'api': {
            const apiData = {
                endpoint: data.endpoint,
                startsWith: data.token.slice(0, 7),
            };

            return JSON.stringify(apiData);
        }
        case 'email': {
            const emailData = {
                notifyTo: data.notifyTo,
                authentication: {
                    host: data.host,
                    port: data.port,
                    secure: data.secure,
                    username: data.username,
                    sender: data.sender,
                },
            };

            return JSON.stringify(emailData);
        }
        default:
            return '';
    }
}
// #endregion module



// #region exports
export {
    registerNotifier,
    deregisterNotifier,
    extractClientNotifierData,
};
// #endregion exports
