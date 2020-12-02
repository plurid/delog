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
        Format as IFormat,
    } from '~server/data/interfaces';

    import {
        addEntityMutation,
    } from '~kernel-services/logic/mutations';

    import {
        GENERATE_FORMAT,
    } from '~kernel-services/graphql/mutate';

    import {
        StyledH1,
        StyledPluridPureButton,
        StyledPluridLinkButton,

        PluridInputLine,
    } from '~kernel-services/styled';
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
        formatIdentifier,
        setFormatIdentifier,
    ] = useState('');
    const [
        formatTransform,
        setFormatTransform,
    ] = useState('');
    const [
        validFormat,
        setValidFormat,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const addFormat = async () => {
        if (!validFormat) {
            return;
        }

        const format: IFormat | undefined = await addEntityMutation(
            {
                identifier: formatIdentifier,
                transform: formatTransform,
            },
            GENERATE_FORMAT,
            'generateFormat',
        );

        if (format) {
            action(format);
        }
    }

    const handleEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            addFormat();
        }
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        if (
            formatIdentifier
            && formatTransform
        ) {
            setValidFormat(true);
        } else {
            setValidFormat(false);
        }
    }, [
        formatIdentifier,
        formatTransform,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledFormat
            theme={theme}
        >
            <StyledH1>
                generate format
            </StyledH1>

            <PluridInputLine
                name="identifier"
                text={formatIdentifier}
                theme={theme}
                atChange={(event) => setFormatIdentifier(event.target.value)}
                atKeyDown={handleEnter}
            />

            <PluridInputLine
                name="transform"
                text={formatTransform}
                theme={theme}
                atChange={(event) => setFormatTransform(event.target.value)}
                atKeyDown={handleEnter}
            />

            <StyledPluridPureButton
                text="Generate Format"
                atClick={() => addFormat()}
                level={2}
                disabled={!validFormat}
            />

            {cancel && (
                <StyledPluridLinkButton
                    text="cancel"
                    atClick={() => cancel()}
                    theme={theme}
                    level={2}
                />
            )}
        </StyledFormat>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Format;
// #endregion exports
