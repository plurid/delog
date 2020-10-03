// #region imports
    // #region external
    import {
        getDelog,
    } from '../../services/utilities';
    // #endregion external
// #endregion imports



// #region module
const setup = async (
    data: any,
) => {
    try {
        const delog = await getDelog();

        if (!delog) {
            console.log('Could not setup delog server. Not logged in.');
            return;
        }

        console.log(`Delog server setup.`);

        return;
    } catch (error) {
        console.log('Could not setup delog server. Something went wrong.');
        return;
    }
}
// #endregion module



// #region exports
export default setup;
// #endregion exports
