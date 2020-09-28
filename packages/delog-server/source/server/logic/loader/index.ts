// #region imports
    // #region external
    import {
        Project,
        Token,
        ClientToken,
        Space,
        Format,
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


export const loadSpaces = async (
    ownerID: string
) => {
    const spaces: Space[] = await database.query(
        'spaces',
        'ownedBy',
        ownerID,
    );

    return spaces;
}


export const loadFormats = async (
    ownerID: string
) => {
    const formats: Format[] = await database.query(
        'formats',
        'ownedBy',
        ownerID,
    );

    return formats;
}


const loadData = async (
    ownerID: string | undefined,
) => {
    if (!ownerID) {
        return {
            projects: [],
            tokens: [],
            spaces: [],
            formats: [],
        };
    }

    const projects = await loadProjects(
        ownerID,
    );

    const tokens = await loadTokens(
        ownerID,
    );

    const spaces = await loadSpaces(
        ownerID,
    );

    const formats = await loadFormats(
        ownerID,
    );

    const data = {
        projects,
        tokens,
        spaces,
        formats,
    };

    return data;
}
// #endregion module



// #region exports
export default loadData;
// #endregion exports
