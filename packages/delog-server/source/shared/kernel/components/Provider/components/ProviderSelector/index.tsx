// #region imports
    // #region libraries
    import React from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region internal
    import githubLogo from './assets/github-logo.png';
    // import bitbucketLogo from './assets/bitbucket-logo.png';

    import ProviderIcon from './components/ProviderIcon';

    import {
        StyledProviderSelector,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface ProviderSelectorProperties {
    // #region required
        // #region values
        theme: Theme;
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

const ProviderSelector: React.FC<ProviderSelectorProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
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
        <StyledProviderSelector
            theme={theme}
        >
            <ProviderIcon
                theme={theme}
                type="github"
                image={githubLogo}
                name="GitHub"
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
            />

            {/* <ProviderIcon
                theme={theme}
                type="bitbucket"
                image={bitbucketLogo}
                name="BitBucket"
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
            /> */}
        </StyledProviderSelector>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default ProviderSelector;
// #endregion exports
