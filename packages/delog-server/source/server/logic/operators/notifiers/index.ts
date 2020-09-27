// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Notifier,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerNotifier = async (
    value: string,
) => {
    const id = uuid.generate();

    const notifier: any = {
        id,
        name: value,
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
// #endregion module



// #region exports
export {
    registerNotifier,
    deregisterNotifier,
};
// #endregion exports
