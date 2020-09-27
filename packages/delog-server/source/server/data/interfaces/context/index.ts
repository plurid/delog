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
        Token,
        Space,
        Format,
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
    tokens: Token[];
    spaces: Space[];
    formats: Format[];
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
