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

    /**
     * ID shared by multiple logs, used to identify a request spanning multiple services.
     */
    sharedID?: string;

    error?: Error;

    /**
     * Arbitrary data: a simple string, stringified JSON or deon.
     */
    extradata?: string;


    text: string;
}


export type RequiredDelogData = Required<Omit<DelogData, 'error'>> & {
    groundLevel: number;

    error: string;

    time: number;
}


export interface LogLevels {
    none: number;
    fatal: number;
    error: number;
    warn: number;
    info: number;
    debug: number;
    trace: number;
    all: number;
}
