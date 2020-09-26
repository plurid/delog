// #region imports
    // #region external
    import {
        Context,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const getSetup = async (
    context: Context,
) => {
    const {
        providers,
        imagenes,
        webhooks,
        repositories,
        projects,
        secrets,
        triggers,
        deployers,
        builds,
        deploys,
        privateUsage,
        privateOwnerIdentonym,
    } = context;


    if (privateUsage) {
        if (!privateOwnerIdentonym) {
            return {
                status: false,
            };
        }

        return {
            status: true,
            data: {
                providers,
                imagenes,
                webhooks,
                repositories,
                projects,
                secrets,
                triggers,
                deployers,
                builds,
                deploys,
            },
        };
    }


    return {
        status: true,
        data: {
            providers,
            imagenes,
            webhooks,
            repositories,
            projects,
            secrets,
            triggers,
            deployers,
            builds,
            deploys,
        },
    };
}
// #endregion module



// #region exports
export default getSetup;
// #endregion exports
