// #region module
export interface DelogData {
    // Required.
    text: string;


    // Configuration optionals.
    endpoint?: string;
    token?: string;

    project?: string;
    space?: string;

    format?: string;


    // Logging optionals.
    /**
     * Log level:
     *
     * + NONE: 7;
     * + FATAL: 6;
     * + ERROR: 5;
     * + WARN: 4;
     * + INFO: 3;
     * + DEBUG: 2;
     * + TRACE: 1;
     * + ALL: 0.
     */
    level?: number;

    /**
     * Name of the method from where the log originates.
     */
    method?: string;

    error?: Error;

    /**
     * Arbitrary data: a simple string, stringified JSON or deon.
     */
    extradata?: string;

    context?: DelogContext;
}



export type RequiredDelogData = Required<
    Omit<DelogData, 'project' | 'space' | 'format' | 'method' | 'error' | 'extradata' | 'context'>
> & {
    time: number;

    groundLevel: number;

    project?: string;
    space?: string;

    format?: string;

    method?: string;
    error?: string;
    extradata?: string;
    context?: DelogContext;
}


export interface DelogLevels {
    fatal: number;
    error: number;
    warn: number;
    info: number;
    debug: number;
    trace: number;
}


export interface DelogTestingContext {
    mode?: 'TESTING' | 'LOGGING';
    suite?: string;
    scenario?: string;

    /**
     * ID shared by multiple logs, used to identify a request spanning multiple services.
     */
    sharedID?: string;
}


export interface DelogContext extends DelogTestingContext {
    /**
     * If using the `sharedID`, the logs can be assigned an ordering number.
     * If not given, the logs will be ordered by time.
     *
     * The value should be greater than 0. If two or more logs have the same value,
     * they will be ordered by time.
     */
    sharedOrder?: number;

    call?: DelogContextCall;
}


export interface DelogContextCall {
    depth?: number;
    repository?: DelogContextCallRepository;
}


export interface DelogContextCallRepository {
    provider?: string;
    name?: string;
    branch?: string;
    commit?: string;
    basePath?: string;
}


export interface DelogInputRecord {
    text: string;
    time: number;
    level: number;

    project?: string;
    space?: string;

    format?: string;

    method?: string;
    error?: string;
    extradata?: string;
    context?: DelogInputRecordContext;
}

export interface DelogInputRecordContext extends DelogTestingContext {
    sharedOrder?: number;
    call?: DelogInputRecordContextCall;
}

export interface DelogInputRecordContextCall {
    repository: DelogInputRecordContextRepository;
    caller: DelogInputRecordContextCaller;
}

export interface DelogInputRecordContextRepository {
    provider: string;
    name: string;
    branch: string;
    commit: string;
    basePath: string;
}

export interface DelogInputRecordContextCaller {
    file: string;
    line: number;
    column: number;
}
// #endregion module
