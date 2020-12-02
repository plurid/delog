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
        Space as ISpace,
    } from '~server/data/interfaces';

    import {
        addEntityMutation,
    } from '~kernel-services/logic/mutations';

    import {
        GENERATE_SPACE,
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
        StyledSpace,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface SpaceProperties {
    // #region required
        // #region values
        theme: Theme;
        // #endregion values

        // #region methods
        action: (
            space: ISpace,
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

const Space: React.FC<SpaceProperties> = (
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
        spaceName,
        setSpaceName,
    ] = useState('');
    const [
        spaceProject,
        setSpaceProject,
    ] = useState('');
    const [
        validSpace,
        setValidSpace,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const addSpace = async () => {
        if (!validSpace) {
            return;
        }

        const space: ISpace | undefined = await addEntityMutation(
            {
                name: spaceName,
                project: spaceProject,
            },
            GENERATE_SPACE,
            'generateSpace',
        );

        if (space) {
            action(space);
        }
    }

    const handleEnter = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            addSpace();
        }
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        if (
            spaceName
            && spaceProject
        ) {
            setValidSpace(true);
        } else {
            setValidSpace(false);
        }
    }, [
        spaceName,
        spaceProject,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledSpace
            theme={theme}
        >
            <StyledH1>
                generate space
            </StyledH1>

            <PluridInputLine
                name="name"
                text={spaceName}
                theme={theme}
                atChange={(event) => setSpaceName(event.target.value)}
                atKeyDown={handleEnter}
            />

            <PluridInputLine
                name="project"
                text={spaceProject}
                theme={theme}
                atChange={(event) => setSpaceProject(event.target.value)}
                atKeyDown={handleEnter}
            />

            <StyledPluridPureButton
                text="Generate Space"
                atClick={() => addSpace()}
                level={2}
                disabled={!validSpace}
            />

            {cancel && (
                <StyledPluridLinkButton
                    text="cancel"
                    atClick={() => cancel()}
                    theme={theme}
                    level={2}
                />
            )}
        </StyledSpace>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Space;
// #endregion exports
