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
        StyledPluridTextline,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';
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
    // #endregion handlers


    // #region render
    return (
        <StyledNotifier
            theme={theme}
        >
            <div>
                <h1>
                    generate notifier
                </h1>

                <div>
                    <StyledPluridTextline
                        text={notifierName}
                        placeholder="name"
                        atChange={(event) => setNotifierName(event.target.value)}
                        atKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                addNotifier();
                            }
                        }}
                        spellCheck={false}
                        autoCapitalize="false"
                        autoComplete="false"
                        autoCorrect="false"
                        theme={theme}
                        level={2}
                    />
                </div>

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
            </div>
        </StyledNotifier>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Notifier;
// #endregion exports
