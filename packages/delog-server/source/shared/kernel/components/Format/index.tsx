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
        Format as IFormat,
    } from '#server/data/interfaces';

    import {
        addEntityMutation,
    } from '#kernel-services/logic/mutations';

    import {
        GENERATE_PROJECT,
    } from '#kernel-services/graphql/mutate';

    import {
        StyledPluridTextline,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        StyledFormat,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface FormatProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        action: (
            format: IFormat,
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

const Format: React.FC<FormatProperties> = (
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
        formatName,
        setFormatName,
    ] = useState('');
    // #endregion state


    // #region handlers
    const addFormat = async () => {
        if (!formatName) {
            return;
        }

        const format: IFormat | undefined = await addEntityMutation(
            {
                value: formatName,
            },
            GENERATE_PROJECT,
            'generateFormat',
        );

        if (format) {
            action(format);
        }
    }
    // #endregion handlers


    // #region render
    return (
        <StyledFormat
            theme={theme}
        >
            <div>
                <h1>
                    add format
                </h1>

                <div>
                    <StyledPluridTextline
                        text={formatName}
                        placeholder="name"
                        atChange={(event) => setFormatName(event.target.value)}
                        atKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                addFormat();
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
                        text="Add Format"
                        atClick={() => addFormat()}
                        level={2}
                        disabled={!formatName}
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
        </StyledFormat>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Format;
// #endregion exports
