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
        project,
        suite,
        scenario,
        configuration,
    } = tester;

    return (
        <>
            <div>
                {project}
            </div>

            <div>
                {suite}
            </div>

            <div>
                {scenario}
            </div>

            <div>
                {configuration}
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
                project,
                suite,
                scenario,
                configuration,
            } = tester;

            const searchTerm = {
                id,
                data: [
                    project.toLowerCase(),
                    suite.toLowerCase(),
                    scenario.toLowerCase(),
                    configuration.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
