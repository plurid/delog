// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconValid,
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        ClientProvider,
    } from '~server/data/interfaces';

    import {
        PluridLinkButton,
    } from '~kernel-services/styled';
    // #endregion external
// #endregion imports




// #region module
export const providerRowRenderer = (
    provider: ClientProvider,
    dispatchSetActiveProviderID: any,
    stateActiveProviderID: string,
    handleObliterateProvider: any,
) => {
    const {
        id,
        name,
        type,
    } = provider;

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    height: '20px',
                    alignItems: 'center',
                }}
            >
                <PluridLinkButton
                    text={name}
                    atClick={() => {
                        dispatchSetActiveProviderID(id);
                    }}
                    inline={true}
                    style={{
                        border: 'none',
                        fontWeight: 'normal',
                    }}
                />

                {stateActiveProviderID === id
                ? (
                    <PluridIconValid
                        inactive={true}
                        style={{
                            marginLeft: '0.7rem',
                        }}
                    />
                ) : (
                    <div />
                )}
            </div>

            <div>
                {type}
            </div>

            <PluridIconDelete
                atClick={() => handleObliterateProvider(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    providers: ClientProvider[],
) => {
    const searchTerms = providers.map(
        provider => {
            const {
                id,
                name,
                type,
            } = provider;

            const searchTerm = {
                id,
                data: [
                    name.toLowerCase(),
                    type.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
