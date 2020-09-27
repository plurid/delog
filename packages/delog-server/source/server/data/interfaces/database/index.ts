// #region module
export type DatabaseType =
    | DatabaseTypeFilesystem
    | DatabaseTypeAmazon
    | DatabaseTypeGoogle
    | DatabaseTypeMongo;

export type DatabaseTypeFilesystem = 'filesystem';
export type DatabaseTypeAmazon = 'amazon';
export type DatabaseTypeGoogle = 'google';
export type DatabaseTypeMongo = 'mongo';

export interface DatabaseTypeData {
    filesystem: DatabaseTypeFilesystem;
    amazon: DatabaseTypeAmazon;
    google: DatabaseTypeGoogle;
    mongo: DatabaseTypeMongo;
}


export interface Database {
    initialize: DatabaseInitialize;
    get: DatabaseGet;
    getAll: DatabaseGetAll;
    query: DatabaseQuery;
    store: DatabaseStore;
    update: DatabaseUpdate;
    obliterate: DatabaseObliterate;
    obliterateAll: DatabaseObliterateAll;
}


export type DatabaseInitialize = () => Promise<boolean>;


export type DatabaseGet = (
    entity: string,
    id: string,
) => Promise<any>;


export type DatabaseGetAll = (
    entity: string,
) => Promise<any[]>;


export type DatabaseQuery = (
    entity: string,
    field: string,
    value: string,
) => Promise<any>;


export type DatabaseStore = (
    entity: string,
    id: string,
    data: any,
) => Promise<any>;


export type DatabaseUpdate = (
    entity: string,
    id: string,
    field: string,
    value: any,
) => Promise<any>;


export type DatabaseObliterate = (
    entity: string,
    id: string,
) => Promise<any>;


export type DatabaseObliterateAll = (
    entity: string,
) => Promise<any>;
// #endregion module
