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
    import InputBox from '../InputBox';
    import InputSwitch from '../InputSwitch';
    // #endregion external


    // #region internal
    import {
        StyledNotifier,
    } from './styled';

    import Selectors from './components/Selectors';
    import NotifyOn from './components/NotifyOn';
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
            notifier: any,
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
    ] = useState('email');
    const [
        notifierName,
        setNotifierName,
    ] = useState('');
    const [
        notifyOn,
        setNotifierNotifyOn,
    ] = useState<string[]>([]);

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
    const [
        notifierNotifyTo,
        setNotifierNotifyTo,
    ] = useState('');

    const [
        validNotifier,
        setValidNotifier,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const addNotifier = async () => {
        if (!validNotifier) {
            return;
        }

        let data = {};

        if (notifierType === 'api') {
            data = {
                endpoint: notifierEndpoint,
                secret: notifierSecret,
            };
        }

        if (notifierType === 'email') {
            const notifyToData = notifierNotifyTo
                .replace(/,/g, '')
                .split(/\n|\s/)
                .map(notifier => notifier.trim())
                .filter(notifier => notifier !== '')
                .reduce((data: string[], item: string) => {
                    if (!data.includes(item)) {
                        data.push(item);
                    }

                    return data;
                }, []);

            data = {
                notifyTo: notifyToData,
                authentication: {
                    host: notifierHost,
                    port: notifierPort,
                    secure: notifierSecure,
                    username: notifierUsername,
                    password: notifierPassword,
                    sender: notifierSender,
                },
            };
        }

        const notifier: any = await addEntityMutation(
            {
                name: notifierName,
                notifyOn,
                type: notifierType,
                data: JSON.stringify(data),
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

    const selectNotifyOn = (
        element: string,
    ) => {
        if (notifyOn.includes(element)) {
            const newElements = notifyOn.filter(el => el !== element);
            setNotifierNotifyOn(newElements);
        } else {
            const newElements = [
                ...notifyOn,
                element,
            ];

            setNotifierNotifyOn(newElements);
        }
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        if (notifierType === 'api') {
            if (
                notifierName
                && notifierEndpoint
                && notifierSecret
                && notifyOn.length > 0
            ) {
                setValidNotifier(true);
            } else {
                setValidNotifier(false);
            }
        }

        if (notifierType === 'email') {
            if (
                notifierName
                && notifierHost
                && notifierPort
                && notifierUsername
                && notifierPassword
                && notifierSender
                && notifierNotifyTo
                && notifyOn.length > 0
            ) {
                setValidNotifier(true);
            } else {
                setValidNotifier(false);
            }
        }
    }, [
        notifierType,
        notifierName,
        notifierEndpoint,
        notifierSecret,
        notifierHost,
        notifierPort,
        notifierUsername,
        notifierPassword,
        notifierSender,
        notifierNotifyTo,
        notifyOn,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledNotifier
            theme={theme}
        >
            <StyledH1>
                generate notifier
            </StyledH1>

            <Selectors
                theme={theme}
                selected={notifierType}
                selectables={[
                    'api', 'email',
                ]}
                select={(element) => setNotifierType(element)}
            />

            <InputLine
                name="name"
                text={notifierName}
                theme={theme}
                atChange={(event) => setNotifierName(event.target.value)}
                atKeyDown={handleEnter}
            />

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

                    <InputBox
                        name="notify to"
                        text={notifierNotifyTo}
                        theme={theme}
                        atChange={(event) => setNotifierNotifyTo(event.target.value)}
                    />
                </>
            )}

            <NotifyOn
                theme={theme}
                selected={notifyOn}
                select={selectNotifyOn}
            />

            <div>
                <StyledPluridPureButton
                    text="Generate Notifier"
                    atClick={() => addNotifier()}
                    level={2}
                    disabled={!validNotifier}
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
