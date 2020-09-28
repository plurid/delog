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
    } from '#server/data/interfaces';

    import {
        addEntityMutation,
    } from '#kernel-services/logic/mutations';

    import {
        GENERATE_SPACE,
    } from '#kernel-services/graphql/mutate';

    import {
        StyledPluridTextline,
        StyledPluridPureButton,
        StyledPluridLinkButton,
    } from '#kernel-services/styled';
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
            },
            GENERATE_SPACE,
            'generateSpace',
        );

        if (space) {
            action(space);
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
            <div>
                <h1>
                    generate space
                </h1>

                <div>
                    <StyledPluridTextline
                        text={spaceName}
                        placeholder="name"
                        atChange={(event) => setSpaceName(event.target.value)}
                        atKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                addSpace();
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
                    <StyledPluridTextline
                        text={spaceProject}
                        placeholder="project"
                        atChange={(event) => setSpaceProject(event.target.value)}
                        atKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                addSpace();
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
                        text="Generate Space"
                        atClick={() => addSpace()}
                        level={2}
                        disabled={!validSpace}
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
        </StyledSpace>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Space;
// #endregion exports
