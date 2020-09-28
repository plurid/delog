// #region imports
    // #region external
    import {
        Project,
        Token,
        ClientToken,
    } from '#server/data/interfaces';

    import database from '#server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const loadProjects = async (
    ownerID: string
) => {
    const projects: Project[] = await database.query(
        'projects',
        'ownedBy',
        ownerID,
    );

    return projects;
}


export const loadTokens = async (
    ownerID: string
) => {
    const tokens: Token[] = await database.query(
        'tokens',
        'ownedBy',
        ownerID,
    );

    const clientTokens = tokens.map(token => {
        const {
            id,
            name,
            startsWith,
        } = token;

        const clientToken: ClientToken = {
            id,
            name,
            startsWith,
        };

        return clientToken;
    });

    return clientTokens;
}



const loadData = async (
    ownerID: string | undefined,
) => {
    if (!ownerID) {
        return {
            projects: [],
            tokens: [],
        };
    }

    const projects = await loadProjects(
        ownerID,
    );

    const tokens = await loadTokens(
        ownerID,
    );

    const data = {
        projects,
        tokens,
    };

    return data;
}
// #endregion module



// #region exports
export default loadData;
// #endregion exports
