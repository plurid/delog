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
        PluridDropdown,
    } from '@plurid/plurid-ui-react';
    // #endregion libraries


    // #region internal
    import {
        StyledRecordsPieChart,
        StyledRecordsPieChartTitle,
        StyledRecordsPieChartProject,
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
        data: RecordsPieChartDataItem[];
        type: string;
        // #endregion values

        // #region methods
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
            data,
            type,
            // #endregion values

            // #region methods
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
        (acc, cv) => acc + cv.value,
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
    ] = useState('hour');
    const [
        selectedProject,
        setSelectedProject,
    ] = useState('all projects');
    // #endregion state


    // #region handlers
    const onPieEnter = (
        data: any,
        index: number,
    ) => {
        setActiveIndex(index);
    }

    const requestData = (
        project: string,
        period: string,
    ) => {

    }
    // #endregion handlers


    // #region render
    return (
        <StyledRecordsPieChart>
            <StyledRecordsPieChartTitle>
                {itemsCount || 'no'} {type} in the last

                <PluridDropdown
                    selected={selectedPeriod}
                    selectables={periodSelectables}
                    atSelect={(selection) => {
                        if (typeof selection === 'string') {
                            requestData(
                                selectedProject,
                                selection,
                            );
                        }
                    }}
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
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx={250}
                    cy={175}
                    innerRadius={50}
                    outerRadius={100}
                    animationDuration={1}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
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
                    ]}
                    atSelect={(selection) => {
                        if (typeof selection === 'string') {
                            requestData(
                                selection,
                                selectedPeriod,
                            );
                        }
                    }}
                    style={{
                        fontSize: '1rem',
                        marginLeft: '0.3rem',
                    }}
                    width={160}
                />
            </StyledRecordsPieChartProject>
        </StyledRecordsPieChart>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RecordsPieChart;
// #endregion exports
