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
    // #endregion external


    // #region internal
    import {
        StyledNotifier,
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
        notifierName,
        setNotifierName,
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

            <InputLine
                name="name"
                text={notifierName}
                theme={theme}
                atChange={(event) => setNotifierName(event.target.value)}
                atKeyDown={handleEnter}
            />

            <div>
                <StyledPluridPureButton
                    text="Generate Notifier"
                    atClick={() => addNotifier()}
                    level={2}
                    disabled={!notifierName}
                />
            </div>

            {cancel && (
                <div>
                    <StyledPluridLinkButton
                        text="cancel"
                        atClick={() => cancel()}
                        theme={theme}
                        level={2}
                    />
                </div>
            )}
        </StyledNotifier>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Notifier;
// #endregion exports
