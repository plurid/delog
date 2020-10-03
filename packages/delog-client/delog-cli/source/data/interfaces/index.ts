export interface Configuration {
    server: string;
    identonym: string;
    key: string;
    token: string;
    isDefault: boolean;
    defaults: ConfigurationDefaults;
}


export interface ConfigurationDefaults {
    format: string;
}
