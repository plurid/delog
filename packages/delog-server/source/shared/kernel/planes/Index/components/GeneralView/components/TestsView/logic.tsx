// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';

    import {
        // PluridIconRunning,
        // PluridIconTimeout,
        // PluridIconWarning,
        PluridIconInvalid,
        PluridIconValid,
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
        time,
        tester,
    } = test;

    const date = (new Date(time * 1000)).toLocaleString();

    return (
        <>
            <div>
                {status
                    ? (
                        <PluridIconValid
                            inactive={true}
                        />
                    ) : (
                        <PluridIconInvalid
                            inactive={true}
                        />
                    )
                }
            </div>

            <div>
                {date}
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
                time,
                tester,
            } = test;

            const date = (new Date(time * 1000)).toLocaleString();

            const searchTerm = {
                id,
                data: [
                    status ? 'success' : 'failed',
                    tester.toLowerCase(),
                    date.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
