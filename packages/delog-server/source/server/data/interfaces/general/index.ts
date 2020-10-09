// #region imports
    // #region libraries
    import {
        DelogInputRecord,
    } from '@plurid/delog';
    // #endregion libraries


    // #region external
    import {
        Notifier,
    } from '../notifier';
    // #endregion external
// #endregion imports



// #region module
export interface Token {
    id: string;
    name: string;
    value: string;
    ownedBy: string;
    startsWith: string;
}

export type ClientToken = Omit<Token, 'value' | 'ownedBy'>;


export interface Project {
    id: string;
    name: string;
    ownedBy: string;

    // generatedBy: string;
    // generatedAt: number;
    // sharedWith: ProjectSharer[];
}

export type ProjectEntityAccess =
    | 'CAN_READ'
    | 'CAN_WRITE';

export interface ProjectSharer {
    id: string;
    access: {
    };
}


export interface Space {
    id: string;
    name: string;
    project: string;
    ownedBy: string;
}


export type CodeProvider =
    | CodeProviderGithub
    | CodeProviderBitbucket;


export type CodeProviderGithub = 'github';
export type CodeProviderBitbucket = 'bitbucket';

export interface CodeProviderData {
    github: CodeProviderGithub;
    bitbucket: CodeProviderBitbucket;
}



export interface Provider {
    id: string;
    token: string;
    type: CodeProvider;
    name: string;
    ownedBy: string;
}

export type ClientProvider = Omit<Provider, 'token'>;


export interface Repository {
    id: string;
    name: string;
    isPrivate: boolean;
    providerID: string;
    ownedBy: string;
}


export interface Format {
    id: string;
    identifier: string;
    transform: string;
    ownedBy: string;
}


export interface Tester {
    id: string;
    project: string;
    suite: string;
    scenario: string;
    configuration: string;
    ownedBy: string;
}


export interface TesterConfiguration {
    phases: TesterConfigurationPhase[];

    /**
     * The test will run after the delay has passed
     * after the first record hits the server.
     *
     * Default: `5_000` milliseconds.
     */
    startDelay?: number;

    /**
     * After the `startDelay`, if the test cannot yet start,
     * it will retry to start.
     *
     * Default: equal to `startDelay`.
     */
    retryDelay?: number;

    /**
     * The test will timeout after the time passed after the `startDelay`.
     *
     * Default: `60_000` milliseconds.
     */
    timeout?: number;
}


export interface TesterConfigurationPhase {
    method?: string;
    text: string;
    level: number | string;
}


export type Record = DelogInputRecord & {
    id: string;
    text: string;

    ownedBy: string;
}


export type LoggedRecord = Record & {
    log: string;
}


export interface Test {
    id: string;
    status: string;
    tester: string;
    ownedBy: string;
}


export interface DelogOwner {
    id: string;
    tokens: Token[];
    projects: Project[];
    spaces: Space[];
    providers: Provider[];
    repositories: Repository[];
    formats: Format[];
    notifiers: any[];
    testers: Tester[];
}


export interface OwnerToken {
    token: string;
}



export interface Commit {
    id: string;
    added: string[];
    removed: string[];
    modified: string[];
}
// #endregion module
