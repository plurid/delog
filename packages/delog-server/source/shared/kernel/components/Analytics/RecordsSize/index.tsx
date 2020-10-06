// #region imports
    // #region libraries
    import React, {
        useRef,
        useState,
        useEffect,
    } from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        PluridIconReset,
    } from '@plurid/plurid-icons-react';

    import {
        PluridDropdown,
    } from '@plurid/plurid-ui-react';
    // #endregion libraries


    // #region external
    import {
        humanByteSize,
    } from '#kernel-services/utilities';
    // #endregion external


    // #region internal
    import {
        StyledRecordsSize,
        StyledRecordsSizeData,
        StyledRecordsSizeRefresh,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface RecordsSizeProperties {
    // #region required
        // #region values
        generalTheme: Theme;
        interactionTheme: Theme;

        size: number;
        project: string;
        projects: string[];
        // #endregion values

        // #region methods
        updateData: (
            project: string,
        ) => void;
        updateProjects: () => void;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion optional
}

const RecordsSize: React.FC<RecordsSizeProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            generalTheme,
            interactionTheme,

            size,
            project,
            projects,
            // #endregion values

            // #region methods
            updateData,
            updateProjects,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion optional
    } = properties;

    const sizeHumanReadable = humanByteSize(size);
    // #endregion properties


    // #region references
    const isMounted = useRef(true);
    // #endregion references


    // #region state
    const [
        selectedProject,
        setSelectedProject,
    ] = useState(project);

    const [
        showIconReset,
        setShowIconReset,
    ] = useState(true);
    // #endregion state


    // #region effects
    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);
    // #endregion effects


    // #region render
    return (
        <StyledRecordsSize
            theme={generalTheme}
        >
            <PluridDropdown
                selected={selectedProject}
                selectables={[
                    'all projects',
                    ...projects,
                ]}
                atSelect={(selection) => {
                    if (typeof selection === 'string') {
                        setSelectedProject(selection);

                        updateData(
                            selection,
                        );
                    }
                }}
                selectAtHover={false}
                style={{
                    fontSize: '1rem',
                    marginLeft: '0.3rem',
                }}
                width={160}
                filterable={true}
                filterUpdate={() => {
                    updateProjects();
                }}
                heightItems={5}
                left={true}
            />

            <StyledRecordsSizeData>
                records size {sizeHumanReadable}
            </StyledRecordsSizeData>

            <StyledRecordsSizeRefresh>
                {showIconReset && (
                    <PluridIconReset
                        atClick={() => {
                            setShowIconReset(false);

                            updateData(selectedProject);

                            setTimeout(() => {
                                if (!isMounted.current) {
                                    return;
                                }

                                setShowIconReset(true);
                            }, 1300);
                        }}
                    />
                )}
            </StyledRecordsSizeRefresh>
        </StyledRecordsSize>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RecordsSize;
// #endregion exports
