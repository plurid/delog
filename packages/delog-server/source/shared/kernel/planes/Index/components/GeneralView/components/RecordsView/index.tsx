// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import { AnyAction } from 'redux';
    import { connect } from 'react-redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        Theme,
    } from '@plurid/plurid-themes';
    // #endregion libraries


    // #region external
    import {
        compareValues,
    } from '#server/utilities/general';

    import {
        Record,
    } from '#server/data/interfaces';

    import EntityView from '#kernel-components/EntityView';

    import {
        getRecords,
    } from '#kernel-services/logic/queries';

    import { AppState } from '#kernel-services/state/store';
    import selectors from '#kernel-services/state/selectors';
    import actions from '#kernel-services/state/actions';

    import {
        getFilterIDs,
    } from '#kernel-services/utilities';
    // #endregion external


    // #region internal
    import {
        recordRowRenderer,
        createSearchTerms,
    } from './logic';
    // #endregion internal
// #endregion imports



// #region module
export interface RecordsViewOwnProperties {
    // #region required
        // #region values
        // #endregion values

        // #region methods
        setGeneralView: any;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion optional
}

export interface RecordsViewStateProperties {
    stateGeneralTheme: Theme;
    stateInteractionTheme: Theme;
    stateRecords: Record[];
}

export interface RecordsViewDispatchProperties {
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    dispatchRemoveEntity: typeof actions.data.removeEntity;
}

export type RecordsViewProperties = RecordsViewOwnProperties
    & RecordsViewStateProperties
    & RecordsViewDispatchProperties;

const RecordsView: React.FC<RecordsViewProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region state
        stateGeneralTheme,
        stateInteractionTheme,
        stateRecords,
        // #endregion state

        // #region dispatch
        dispatch,
        // #endregion dispatch
    } = properties;
    // #endregion properties


    // #region handlers
    const handleRecordObliterate = async (
        id: string,
    ) => {
        try {

        } catch (error) {
            return;
        }
    }
    // #endregion handlers


    // #region state
    const [searchTerms, setSearchTerms] = useState(
        createSearchTerms(stateRecords),
    );

    const [filteredRows, setFilteredRows] = useState(
        stateRecords.map(
            record => recordRowRenderer(
                record,
                handleRecordObliterate,
            ),
        ),
    );
    // #endregion state


    // #region handlers
    const filterUpdate = (
        rawValue: string,
    ) => {
        const value = rawValue.toLowerCase();

        const filterIDs = getFilterIDs(
            searchTerms,
            value,
        );

        const filteredRecords = stateRecords.filter(stateRecord => {
            if (filterIDs.includes(stateRecord.id)) {
                return true;
            }

            return false;
        });

        const sortedRecords = filteredRecords.sort(
            compareValues('name'),
        );

        setFilteredRows(
            sortedRecords.map(
                record => recordRowRenderer(
                    record,
                    handleRecordObliterate,
                ),
            ),
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const searchTerms = createSearchTerms(
            stateRecords,
        );
        const filteredRows = stateRecords.map(
            record => recordRowRenderer(
                record,
                handleRecordObliterate,
            ),
        );

        setSearchTerms(searchTerms);
        setFilteredRows(filteredRows);
    }, [
        stateRecords,
    ]);

    useEffect(() => {
        getRecords(dispatch);
    }, []);
    // #endregion effects


    // #region render
    const rowsHeader = (
        <>
            <div>
                project
            </div>

            <div>
                space
            </div>

            <div>
                level
            </div>

            <div>
                log
            </div>

            <div />
        </>
    );

    return (
        <EntityView
            generalTheme={stateGeneralTheme}
            interactionTheme={stateInteractionTheme}

            rowTemplate="0.5fr 0.5fr 60px 3fr 30px"
            rowsHeader={rowsHeader}
            rows={filteredRows}
            noRows="no records"

            filterUpdate={filterUpdate}
            refresh={() => {
                getRecords(dispatch);
            }}
        />
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): RecordsViewStateProperties => ({
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
    stateInteractionTheme: selectors.themes.getInteractionTheme(state),
    stateRecords: selectors.data.getRecords(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): RecordsViewDispatchProperties => ({
    dispatch,
    dispatchRemoveEntity: (
        payload,
    ) => dispatch (
        actions.data.removeEntity(payload),
    ),
});


const ConnectedRecordsView = connect(
    mapStateToProperties,
    mapDispatchToProperties,
)(RecordsView);
// #endregion module



// #region exports
export default ConnectedRecordsView;
// #endregion exports
