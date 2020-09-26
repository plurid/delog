// #region imports
    // #region libraries
    import {
        Application,
    } from 'express';
    // #endregion libraries


    // #region external
    import {
        loadWebhooks,
    } from '#server/logic/loader';

    import {
        handleWebhooks,
    } from '#server/logic/webhooks';
    // #endregion external
// #endregion imports



// #region module
const setupWebhooks = async (
    instance: Application,
) => {
    const webhooks = await loadWebhooks();

    handleWebhooks(
        webhooks,
        instance,
    );
}
// #endregion module



// #region exports
export default setupWebhooks;
// #endregion exports
