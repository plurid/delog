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
        status,
        tester,
    } = test;

    return (
        <>
            <div>
                {status}
            </div>

            <div>
                {tester}
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
                status,
                tester,
            } = test;

            const searchTerm = {
                id,
                data: [
                    status.toLowerCase(),
                    tester.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
