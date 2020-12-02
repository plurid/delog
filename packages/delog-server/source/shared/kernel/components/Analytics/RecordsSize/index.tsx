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
        PluridDropdown,
        PluridRefreshButton,
    } from '~kernel-services/styled';

    import {
        humanByteSize,
    } from '~kernel-services/utilities';
    // #endregion external


    // #region internal
    import {
        StyledRecordsSize,
        StyledRecordsSizeData,
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


    // #region state
    const [
        selectedProject,
        setSelectedProject,
    ] = useState(project);
    // #endregion state


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

            <PluridRefreshButton
                atClick={() => {
                    updateData(selectedProject);
                }}
            />
        </StyledRecordsSize>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RecordsSize;
// #endregion exports
