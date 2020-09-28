// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region external
    import {
        Notifier as INotifier,
    } from '#server/data/interfaces';

    import {
        addEntityMutation,
    } from '#kernel-services/logic/mutations';

    import {
        GENERATE_NOTIFIER,
    } from '#kernel-services/graphql/mutate';

    import {
        StyledH1,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';

    import InputLine from '../InputLine';
    import InputSwitch from '../InputSwitch';
    // #endregion external


    // #region internal
    import {
        StyledNotifier,
        StyledSelectors,
        StyledSelector,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface NotifierProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        action: (
            notifier: INotifier,
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

const Notifier: React.FC<NotifierProperties> = (
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
        notifierType,
        setNotifierType,
    ] = useState('');
    const [
        notifierName,
        setNotifierName,
    ] = useState('');

    const [
        notifierEndpoint,
        setNotifierEndpoint,
    ] = useState('');
    const [
        notifierSecret,
        setNotifierSecret,
    ] = useState('');

    const [
        notifierHost,
        setNotifierHost,
    ] = useState('');
    const [
        notifierPort,
        setNotifierPort,
    ] = useState('');
    const [
        notifierSecure,
        setNotifierSecure,
    ] = useState(false);
    const [
        notifierUsername,
        setNotifierUsername,
    ] = useState('');
    const [
        notifierPassword,
        setNotifierPassword,
    ] = useState('');
    const [
        notifierSender,
        setNotifierSender,
    ] = useState('');
    // #endregion state


    // #region handlers
    const addNotifier = async () => {
        if (!notifierName) {
            return;
        }

        const notifier: INotifier | undefined = await addEntityMutation(
            {
                name: notifierName,
            },
            GENERATE_NOTIFIER,
            'generateNotifier',
        );

        if (notifier) {
            action(notifier);
        }
    }

    const handleEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            addNotifier();
        }
    }
    // #endregion handlers


    // #region render
    return (
        <StyledNotifier
            theme={theme}
        >
            <StyledH1>
                generate notifier
            </StyledH1>

            <StyledSelectors>
                <StyledSelector
                    theme={theme}
                    selected={notifierType === 'api'}
                    onClick={() => setNotifierType('api')}
                >
                    api
                </StyledSelector>

                <StyledSelector
                    theme={theme}
                    selected={notifierType === 'email'}
                    onClick={() => setNotifierType('email')}
                >
                    email
                </StyledSelector>
            </StyledSelectors>


            {notifierType === 'api' && (
                <>
                    <InputLine
                        name="endpoint"
                        text={notifierEndpoint}
                        theme={theme}
                        atChange={(event) => setNotifierEndpoint(event.target.value)}
                        atKeyDown={handleEnter}
                    />

                    <InputLine
                        name="secret"
                        text={notifierSecret}
                        theme={theme}
                        atChange={(event) => setNotifierSecret(event.target.value)}
                        atKeyDown={handleEnter}
                    />
                </>
            )}


            {notifierType === 'email' && (
                <>
                    <InputLine
                        name="host"
                        text={notifierHost}
                        theme={theme}
                        atChange={(event) => setNotifierHost(event.target.value)}
                        atKeyDown={handleEnter}
                    />

                    <InputLine
                        name="port"
                        text={notifierPort}
                        theme={theme}
                        atChange={(event) => setNotifierPort(event.target.value)}
                        atKeyDown={handleEnter}
                    />

                    <InputSwitch
                        name="secure"
                        checked={notifierSecure}
                        theme={theme}
                        atChange={() => setNotifierSecure(secure => !secure)}
                    />

                    <InputLine
                        name="username"
                        text={notifierUsername}
                        theme={theme}
                        atChange={(event) => setNotifierUsername(event.target.value)}
                        atKeyDown={handleEnter}
                    />

                    <InputLine
                        name="password"
                        text={notifierPassword}
                        theme={theme}
                        atChange={(event) => setNotifierPassword(event.target.value)}
                        atKeyDown={handleEnter}
                    />

                    <InputLine
                        name="sender"
                        text={notifierSender}
                        theme={theme}
                        atChange={(event) => setNotifierSender(event.target.value)}
                        atKeyDown={handleEnter}
                    />
                </>
            )}

            <div>
                <StyledPluridPureButton
                    text="Generate Notifier"
                    atClick={() => addNotifier()}
                    level={2}
                    disabled={!notifierName}
                />
            </div>

            {cancel && (
                <StyledPluridLinkButton
                    text="cancel"
                    atClick={() => cancel()}
                    theme={theme}
                    level={2}
                />
            )}
        </StyledNotifier>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Notifier;
// #endregion exports
