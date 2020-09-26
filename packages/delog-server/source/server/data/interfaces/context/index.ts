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
        DelogLogic,
    } from '../logic';

    import {
        Logger,
        LogLevels,
    } from '../logger';
    // #endregion external
// #endregion imports



// #region module
export interface Context {
    request: DelogRequest;
    response: Response;

    instance: Application;

    projects: Project[];
    records: any[];

    customLogicUsage: boolean;

    privateUsage: boolean;
    privateOwnerIdentonym: string | undefined;

    logger: Logger;
    logLevel: number;
    logLevels: LogLevels;
}


export type DelogRequest = Request & {
    delogLogic: DelogLogic | undefined;
    rawBody: string | undefined;
}
// #endregion module
