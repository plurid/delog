// #region imports
    // #region libraries
    import {
        Request,
    } from 'express';
    // #endregion libraries


    // #region external
    import {
        COOKIE_PRIVATE_TOKEN,

        PRIVATE_TOKEN,
        PRIVATE_OWNER_IDENTONYM,

        TEST_MODE,
    } from '#server/data/constants';
    // #endregion external
// #endregion imports



// #region module
const getToken = (
    request: Request,
) => {
    const cookie = request.cookies[COOKIE_PRIVATE_TOKEN];
    if (cookie) {
        return Buffer
            .from(cookie, 'base64')
            .toString('utf-8');
    }

    const bearer = request.headers.authorization;

    if (!bearer) {
        return '';
    }

    return bearer.replace('Bearer ', '');
}


const getPrivateOwner = (
    request: Request,
) => {
    try {
        const token = getToken(request);

        if (TEST_MODE) {
            if (token === '__TESTS__') {
                return PRIVATE_OWNER_IDENTONYM;
            }
        }

        if (token !== PRIVATE_TOKEN) {
            return;
        }

        return PRIVATE_OWNER_IDENTONYM;
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    getPrivateOwner,
};
// #endregion exports
