// #region imports
    // #region external
    import {
        Context,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const verifyUniqueID = async (
    input: any,
    context: Context,
) => {
    const {
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
        };
    }


    return {
        status: true,
    };
}
// #endregion module



// #region exports
export default verifyUniqueID;
// #endregion exports
