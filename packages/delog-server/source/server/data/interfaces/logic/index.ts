// #region imports
    // #region external
    import {
        DelogOwner,
        OwnerToken,
    } from '../general';

    import {
        Notifier,
    } from '../notifier';

    import {
        Logger,
    } from '../logger';

    import {
        InputValueString,
    } from '../inputs';
    // #endregion external
// #endregion imports



// #region module
export interface DelogLogic {
    getCurrentOwner: () => Promise<DelogOwner>;
    checkOwnerToken: (
        token: string,
    ) => Promise<boolean>;
    getOwnerToken: (
        identonym: string,
        key: string,
    ) => Promise<OwnerToken>;
    logger: Logger;
}
// #endregion module
