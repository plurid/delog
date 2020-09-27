// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Tester,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const testerRowRenderer = (
    tester: Tester,
    handleTesterObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
    } = tester;

    return (
        <>
            <div>
                {/* {name} */}
            </div>

            <PluridIconDelete
                atClick={() => handleTesterObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    testers: Tester[],
) => {
    const searchTerms = testers.map(
        tester => {
            const {
                id,
            } = tester;

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
