// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Test,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const testRowRenderer = (
    test: Test,
    handleTestObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
    } = test;

    return (
        <>
            <div>
                {/* {name} */}
            </div>

            <PluridIconDelete
                atClick={() => handleTestObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    tests: Test[],
) => {
    const searchTerms = tests.map(
        test => {
            const {
                id,
            } = test;

            const searchTerm = {
                id,
                data: [
                    // name.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
