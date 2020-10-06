// #region imports
    // #region libraries
    import React from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region internal
    import {
        StyledProviderIcon,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface ProviderIconProperties {
    // #region required
        // #region values
        theme: Theme;
        type: string;
        image: string;
        name: string;
        selectedProvider: string;
        // #endregion values

        // #region methods
        setSelectedProvider: React.Dispatch<React.SetStateAction<string>>;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion optional
}

const ProviderIcon: React.FC<ProviderIconProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            type,
            image,
            name,
            selectedProvider,
            // #endregion values

            // #region methods
            setSelectedProvider,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region render
    return (
        <StyledProviderIcon
            theme={theme}
            selected={selectedProvider === type}
            onClick={() => {
                if (selectedProvider !== type) {
                    setSelectedProvider(type)
                } else {
                    setSelectedProvider('');
                }
            }}
        >
            <div>
                <img
                    src={image}
                    alt={name}
                    height={50}
                />
            </div>

            <div>
                <h2
                    style={{
                        margin: '0',
                        marginTop: '15px',
                    }}
                >
                    {name}
                </h2>
            </div>
        </StyledProviderIcon>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default ProviderIcon;
// #endregion exports
