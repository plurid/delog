// #region imports
    // #region external
    import {
        InputObliterateTests,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const deregisterTest = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'tests',
            {
                id,
            },
        );
    } catch (error) {
        return;
    }
}


const deregisterTests = async (
    ownedBy: string,
    data?: InputObliterateTests,
) => {
    try {
        if (!data) {
            await database.obliterateAll(
                'tests',
                {
                    ownedBy,
                },
            );

            return;
        }

        const {
            // filter,
            ids,
        } = data;

        if (ids) {
            for (const id of ids) {
                deregisterTest(id);
            }

            return;
        }

        // remove based on filter
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    deregisterTest,
    deregisterTests,
};
// #endregion exports
