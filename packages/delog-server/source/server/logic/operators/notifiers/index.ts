// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        ClientNotifier,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
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

    const clientData = extractClientNotifierData(
        value.type,
        value.data as any,
    );

    const clientNotifer = {
        id,
        name: value.name,
        type: value.type,
        notifyOn: value.notifyOn,
        data: clientData,
    };

    return clientNotifer;
}


const deregisterNotifier = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'notifiers',
            {
                id,
            },
        );
    } catch (error) {
        return;
    }
}


const extractClientNotifierData = (
    type: any,
    data: any,
) => {
    try {
        switch (type) {
            case 'api': {
                const apiData = {
                    endpoint: data.endpoint,
                    startsWith: data.secret.slice(0, 7),
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
    } catch (error) {
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
