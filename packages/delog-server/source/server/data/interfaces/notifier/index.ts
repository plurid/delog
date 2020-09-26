// #region module
export type Notifier =
    | NotifierAPI
    | NotifierEmail;


export type ClientNotifier =
    | ClientNotifierAPI
    | ClientNotifierEmail;


export interface NotifierBase {
    id: string;
    notifyOn: NotificationType[];
}

export interface NotifierAPI extends NotifierBase {
    type: NotifierTypeAPI;
    data: StoredNotifierAPIData;
}

export interface ClientNotifierAPI extends NotifierBase {
    type: NotifierTypeAPI;
    data: ClientNotifierAPIData;
}

export interface NotifierEmail extends NotifierBase {
    type: NotifierTypeEmail;
    data: StoredNotifierEmailData;
}

export interface ClientNotifierEmail extends NotifierBase {
    type: NotifierTypeEmail;
    data: ClientNotifierEmailData;
}


export type NotifierTypeAPI = 'api';
export type NotifierTypeEmail = 'email';
export type NotifierType =
    | NotifierTypeAPI
    | NotifierTypeEmail;


export interface NotifierEmailBase {
    notifyTo: string[];
}

export interface StoredNotifierEmailData extends NotifierEmailBase {
    authentication: NotifierEmailAuthentication;
}

export interface ClientNotifierEmailData extends NotifierEmailBase {
    authentication: ClientNotifierEmailAuthentication;
}

export type ClientNotifierEmailAuthentication = Omit<NotifierEmailAuthentication, 'password'>;

export interface NotifierEmailAuthentication {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    sender: string;
}


export interface NotifierAPIBaseData {
    endpoint: string;
}

export interface StoredNotifierAPIData extends NotifierAPIBaseData {
    token: string;
}

export interface ClientNotifierAPIData extends NotifierAPIBaseData {
    startsWith: string;
}


export interface Notification {
    status: 'SUCCESS' | 'ERROR';
    kind: 'REGISTER' | 'DEREGISTER';
    entity:
        | 'PROVIDER' | 'IMAGENE' | 'REPOSITORY' | 'WEBHOOK' | 'PROJECT' | 'SECRET' | 'TRIGGER' | 'DEPLOYER'
        | 'BUILD' | 'DEPLOY';
    data: string;
}

export type NotificationType =
    | 'REGISTER_PROVIDER'
    | 'DEREGISTER_PROVIDER'
    | 'REGISTER_IMAGENE'
    | 'DEREGISTER_IMAGENE'
    | 'REGISTER_REPOSITORY'
    | 'DEREGISTER_REPOSITORY'
    | 'REGISTER_WEBHOOK'
    | 'DEREGISTER_WEBHOOK'
    | 'REGISTER_PROJECT'
    | 'DEREGISTER_PROJECT'
    | 'REGISTER_SECRET'
    | 'DEREGISTER_SECRET'
    | 'REGISTER_TRIGGER'
    | 'DEREGISTER_TRIGGER'
    | 'REGISTER_DEPLOYER'
    | 'DEREGISTER_DEPLOYER'
    | 'REGISTER_BUILD'
    | 'DEREGISTER_BUILD'
    | 'REGISTER_DEPLOY'
    | 'DEREGISTER_DEPLOY';

export type NotificationTypes = Record<NotificationType, NotificationType>;
// #endregion module
