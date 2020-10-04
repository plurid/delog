// #region module
export interface DelogData {
    // Configuration optionals
    format?: string;

    endpoint?: string;
    token?: string;

    project?: string;
    space?: string;


    // Logging optionals
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

    text: string;
}


export type RequiredDelogData = Required<
    Omit<DelogData, 'error'>
> & {
    groundLevel: number;

    error: string;

    time: number;
}


export interface DelogLevels {
    none: number;
    fatal: number;
    error: number;
    warn: number;
    info: number;
    debug: number;
    trace: number;
    all: number;
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
    codeProvider?: string;
    repositoryName?: string;
    repositoryBasePath?: string;
}


export interface DelogInputRecord {
    format: string;

    project: string;
    space: string;

    level: number;
    method: string;
    error: string;
    extradata: string;

    context: DelogInputRecordContext;

    text: string;

    time: number;
}

export interface DelogInputRecordContext extends DelogTestingContext {
    sharedOrder?: number;
    call?: DelogInputRecordContextCall;
}

export interface DelogInputRecordContextCall {
    provider: string;
    repository: string;
    caller: DelogInputRecordContextCaller;
}

export interface DelogInputRecordContextCaller {
    file: string;
    line: number;
    column: number;
}
// #endregion module
