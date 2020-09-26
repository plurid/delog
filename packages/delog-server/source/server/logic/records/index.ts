// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Project,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerRecord = async (
    name: string,
) => {
    const id = uuid.generate();

    const project: Project = {
        id,
        name,
    };

    await database.store(
        'project',
        id,
        project,
    );

    return project;
}


const deregisterRecord = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'project',
            id,
        );
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    registerRecord,
    deregisterRecord,
};
// #endregion exports
