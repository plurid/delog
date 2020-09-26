// #region imports
    // #region libraries
    import {
        Request,
        Response,
        Application,
    } from 'express';
    // #endregion libraries


    // #region external
    import {
        Project,
    } from '../general';

    import {
        Notifier,
    } from '../notifier';

    import {
        PerformerLogic,
    } from '../logic';

    import {
        Logger,
        LogLevels,
    } from '../logger';
    // #endregion external
// #endregion imports



// #region module
export interface Context {
    request: PerformerRequest;
    response: Response;

    instance: Application;

    projects: Project[];

    customLogicUsage: boolean;

    privateUsage: boolean;
    privateOwnerIdentonym: string | undefined;

    logger: Logger;
    logLevel: number;
    logLevels: LogLevels;
}


export type PerformerRequest = Request & {
    performerLogic: PerformerLogic | undefined;
    rawBody: string | undefined;
}
// #endregion module
