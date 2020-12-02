// #region imports
    // #region libraries
    import React, {
        useState,
    } from 'react';

    import {
        PieChart,
        Pie,
        Cell,
    } from 'recharts';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        PluridIconReset,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        PluridDropdown,
        PluridRefreshButton,
    } from '~kernel-services/styled';
    // #endregion external


    // #region internal
    import {
        StyledRecordsPieChart,
        StyledRecordsPieChartTitle,
        StyledRecordsPieChartProject,
        StyledRecordsPieChartRefresh,
    } from './styled';

    import {
        renderActiveShape,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
const colors = {
    fatal: '#000000',
    error: '#ff0000',
    warn: '#fcf512',
    info: '#4cf5e1',
    debug: '#4accff',
    trace: '#03b8ff',
};

const periodSelectables = [
    'hour',
    '24 hours',
    '7 days',
    '30 days',
];


export interface RecordsPieChartDataItem {
    name: string,
    value: number,
}

export interface RecordsPieChartProperties {
    // #region required
        // #region values
        generalTheme: Theme;
        interactionTheme: Theme;
        data: RecordsPieChartDataItem[];
        type: string;

        project: string;
        period: string;
        projects: string[];
        // #endregion values

        // #region methods
        updateData: (
            project: string,
            period: string,
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

const RecordsPieChart: React.FC<RecordsPieChartProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            generalTheme,
            interactionTheme,
            data,
            type,

            period,
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

    const itemsCount = data.reduce(
        (accumulator, current) => accumulator + current.value,
        0,
    );
    // #endregion properties


    // #region state
    const [
        activeIndex,
        setActiveIndex,
    ] = useState(-1);

    const [
        selectedPeriod,
        setSelectedPeriod,
    ] = useState(period);
    const [
        selectedProject,
        setSelectedProject,
    ] = useState(project);
    // #endregion state


    // #region handlers
    const onPieEnter = (
        data: any,
        index: number,
    ) => {
        if (!itemsCount) {
            return;
        }

        setActiveIndex(index);
    }

    const requestData = (
        project: string,
        period: string,
    ) => {
        updateData(project, period);
    }
    // #endregion handlers


    // #region render
    return (
        <StyledRecordsPieChart
            theme={generalTheme}
        >
            <StyledRecordsPieChartTitle>
                {itemsCount || 'no'} {type} in the last

                <PluridDropdown
                    selected={selectedPeriod}
                    selectables={periodSelectables}
                    atSelect={(selection) => {
                        if (typeof selection === 'string') {
                            setSelectedPeriod(selection);

                            requestData(
                                selectedProject,
                                selection,
                            );
                        }
                    }}
                    selectAtHover={false}
                    style={{
                        fontSize: '1rem',
                        marginLeft: '0.3rem',
                    }}
                    width={100}
                />
            </StyledRecordsPieChartTitle>

            <PieChart
                width={500}
                height={350}
            >
                <Pie
                    activeIndex={itemsCount ? activeIndex : -1}
                    activeShape={(properties) =>renderActiveShape(
                        properties,
                        interactionTheme,
                    )}
                    data={itemsCount
                        ? data : [
                            {
                                name: 'none',
                                value: 100,
                            },
                        ]
                    }
                    cx={250}
                    cy={175}
                    innerRadius={50}
                    outerRadius={100}
                    animationDuration={1}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    style={{
                        opacity: itemsCount ? '1' : '0.1',
                        stroke: 'none',
                    }}
                >
                    {
                        data.map((entry, index) => {
                            return (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[entry.name]}
                                />
                            );
                        })
                    }
                </Pie>
            </PieChart>

            <StyledRecordsPieChartProject>
                <PluridDropdown
                    selected={selectedProject}
                    selectables={[
                        'all projects',
                        ...projects,
                    ]}
                    atSelect={(selection) => {
                        if (typeof selection === 'string') {
                            setSelectedProject(selection);

                            requestData(
                                selection,
                                selectedPeriod,
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
                />
            </StyledRecordsPieChartProject>

            <StyledRecordsPieChartRefresh>
                <PluridRefreshButton
                    atClick={() => {
                        requestData(
                            selectedProject,
                            selectedPeriod,
                        );
                    }}
                />
            </StyledRecordsPieChartRefresh>
        </StyledRecordsPieChart>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RecordsPieChart;
// #endregion exports
