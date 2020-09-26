export interface DelogData {
    endpoint?: string;
    token?: string;
    project?: string;
    package?: string;
    format?: string;
    method: string;
    level: string;
    state: string;
}


export type RequiredDelogData = Required<DelogData> & {
    groundLevel: string;
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
