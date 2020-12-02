// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
        PluridIconInfo,
        // PluridIconRunning,
        // PluridIconTimeout,
        // PluridIconWarning,
        PluridIconInvalid,
        PluridIconValid,
    } from '@plurid/plurid-icons-react';

    import {
        PluridLink,
    } from '@plurid/plurid-react';
    // #endregion libraries


    // #region external
    import {
        Test,
    } from '~server/data/interfaces';
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

            <div>
                {date}
            </div>

            <div>
                {tester}
            </div>

            <PluridLink
                route={`/test/${id}`}
                devisible={true}
            >
                <PluridIconInfo
                    atClick={() => {}}
                />
            </PluridLink>

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
