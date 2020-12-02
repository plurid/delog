// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region external
    import {
        Provider as IProvider,
    } from '~server/data/interfaces';

    import {
        ADD_PROVIDER,
    } from '~kernel-services/graphql/mutate';

    import {
        addEntityMutation,
    } from '~kernel-services/logic/mutations';

    import {
        StyledH1,
        StyledPluridPureButton,
        StyledPluridLinkButton,

        PluridInputLine,
    } from '~kernel-services/styled';
    // #endregion external


    // #region internal
    import ProviderSelector from './components/ProviderSelector';

    import {
        StyledProvider,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface ProviderProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        action: (
            provider: IProvider,
        ) => void;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        cancel?: () => void;
        // #endregion methods
    // #endregion optional
}

const Provider: React.FC<ProviderProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            // #endregion values

            // #region methods
            action,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            cancel,
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region state
    const [
        providerType,
        setProviderType,
    ] = useState('github');
    const [
        providerName,
        setProviderName,
    ] = useState('');
    const [
        providerToken,
        setProviderToken,
    ] = useState('');
    const [
        validProvider,
        setValidProvider,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const addProvider = async () => {
        if (!validProvider) {
            return;
        }

        const provider: IProvider | undefined = await addEntityMutation(
            {
                type: providerType,
                token: providerToken,
                name: providerName,
            },
            ADD_PROVIDER,
            'addProvider',
        );

        if (provider) {
            action(provider);
        }
    }

    const handleEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            addProvider();
        }
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        if (
            providerType
            && providerToken
            && providerName
        ) {
            setValidProvider(true)
        } else {
            setValidProvider(false);
        }
    }, [
        providerType,
        providerToken,
        providerName,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledProvider
            theme={theme}
        >
            <StyledH1>
                setup provider
            </StyledH1>

            <ProviderSelector
                theme={theme}
                selectedProvider={providerType}
                setSelectedProvider={setProviderType}
            />

            <PluridInputLine
                name="name"
                text={providerName}
                theme={theme}
                atChange={(event) => setProviderName(event.target.value)}
                atKeyDown={handleEnter}
            />

            <PluridInputLine
                name="token"
                text={providerToken}
                theme={theme}
                atChange={(event) => setProviderToken(event.target.value)}
                atKeyDown={handleEnter}
            />

            <StyledPluridPureButton
                text="Add Provider"
                atClick={() => addProvider()}
                disabled={!validProvider}
                theme={theme}
                level={2}
            />

            {cancel && (
                <StyledPluridLinkButton
                    text="cancel"
                    atClick={() => cancel()}
                    theme={theme}
                    level={2}
                />
            )}
        </StyledProvider>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Provider;
// #endregion exports
