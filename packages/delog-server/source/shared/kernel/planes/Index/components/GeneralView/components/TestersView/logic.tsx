// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Tester,
    } from '~server/data/interfaces';

    import {
        PluridLinkButton,
    } from '~kernel-services/styled';
    // #endregion external
// #endregion imports



// #region module
export interface ConfigurationProperties {
    data: string,
}

const Configuration: React.FC<ConfigurationProperties> = (
    properties,
) => {
    // #region properties
    const {
        data,
    } = properties;
    // #endregion properties


    // #region state
    const [
        showConfiguration,
        setShowConfiguration,
    ] = useState(false);
    // #endregion state


    // #region render
    return (
        <div>
            <PluridLinkButton
                text={showConfiguration ? 'hide' : 'show'}
                atClick={() => setShowConfiguration(show => !show)}
                inline={true}
                style={{
                    border: 'none',
                }}
            />

            {showConfiguration && (
                <pre>
                    {data}
                </pre>
            )}
        </div>
    );
    // #endregion render
}


export const testerRowRenderer = (
    tester: Tester,
    handleTesterObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        name,
        project,
        suite,
        scenario,
        configuration,
    } = tester;

    return (
        <>
            <div>
                {id}
            </div>

            <div>
                {name}
            </div>

            <div>
                {project}
            </div>

            <div>
                {suite}
            </div>

            <div>
                {scenario}
            </div>

            <Configuration
                data={configuration}
            />

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
                name,
                project,
                suite,
                scenario,
                configuration,
            } = tester;

            const searchTerm = {
                id,
                data: [
                    id.toLowerCase(),
                    name.toLowerCase(),
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
