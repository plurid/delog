// #region imports
    // #region libraries
    import {
        promises as fs,
    } from 'fs';

    import Deon, {
        typer,
    } from '@plurid/deon';
    // #endregion libraries


    // #region external
    import {
        Configuration,
    } from '../../../data/interfaces';

    import {
        defaultConfiguration,
        delogConfigurationPath,
    } from '../../../data/constants';

    import {
        fileExists,
    } from '../general';
    // #endregion external
// #endregion imports



// #region module
const writeConfiguration = async (
    data: any,
) => {
    const deon = new Deon();
    const dataString = deon.stringify(data);

    await fs.writeFile(
        delogConfigurationPath,
        dataString,
    );
}


const updateConfiguration = async (
    server: string,
    identonym: string,
    data: Partial<Configuration>,
) => {
    try {
        const configurations = await readConfigurations();

        let updatedConfiguration = false;

        const updatedConfigurations = configurations.map(configuration => {
            if (
                configuration.server === server
                && configuration.identonym === identonym
            ) {
                updatedConfiguration = true;
                return {
                    ...configuration,
                    ...data,
                };
            }

            return {
                ...configuration,
            };
        });

        if (!updatedConfiguration) {
            updatedConfigurations.push({
                ...defaultConfiguration,
                ...data,
            });
        }

        await writeConfiguration(updatedConfigurations);

        return true;
    } catch (error) {
        return false;
    }
}


const readConfigurations = async () => {
    try {
        const exists = await fileExists(delogConfigurationPath);

        if (!exists) {
            await fs.writeFile(
                delogConfigurationPath,
                '',
            );
            return [] as Configuration[];
        }

        const data = await fs.readFile(
            delogConfigurationPath,
            'utf-8',
        );

        const deon = new Deon();
        const configurationsData: Configuration[] = typer(await deon.parse(data));

        if (!Array.isArray(configurationsData)) {
            return [];
        }

        return configurationsData;
    } catch (error) {
        return [];
    }
}


const getDefaultConfiguration = async () => {
    const data = await readConfigurations();

    if (data.length === 0) {
        return;
    }

    if (data.length === 1) {
        return data[0];
    }

    for (const configuration of data) {
        if (configuration.isDefault) {
            return configuration;
        }
    }

    return data[0];
}


const getConfiguration = async (
    server?: string,
    identonym?: string,
) => {
    if (!server || !identonym) {
        return await getDefaultConfiguration();
    }

    const configurations = await readConfigurations();

    const configuration = configurations.find(configuration => {
        if (
            configuration.server === server
            && configuration.identonym === identonym
        ) {
            return true;
        }

        return false;
    });

    return configuration;
}


const removeConfiguration = async (
    server?: string,
    identonym?: string,
) => {
    const configurations = await readConfigurations();

    let removedConfiguration = false;
    let updatedConfigurations: Configuration[] = [];

    updatedConfigurations = configurations.filter(configuration => {
        if (
            server === configuration.server
            && identonym === configuration.identonym
        ) {
            removedConfiguration = true;
            return false;
        }

        if (!server && !identonym && configuration.isDefault) {
            removedConfiguration = true;
            return false;
        }

        return true;
    });

    if (!removedConfiguration) {
        updatedConfigurations = updatedConfigurations.slice(1);
    }

    await writeConfiguration(updatedConfigurations);

    return;
}
// #endregion module



// #region exports
export {
    readConfigurations,
    updateConfiguration,
    getDefaultConfiguration,
    getConfiguration,
    removeConfiguration,
};
// #endregion exports
