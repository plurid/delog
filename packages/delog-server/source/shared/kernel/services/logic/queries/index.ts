// #region imports
    // #region libraries
    import { AnyAction } from 'redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        graphql,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        InputQuery,
    } from '#server/data/interfaces';

    import client from '#kernel-services/graphql/client';

    import {
        GET_CURRENT_OWNER,
        GET_USAGE_TYPE,
        GET_RECORDS,
        GET_TESTS,
    } from '#kernel-services/graphql/query';

    import actions from '#kernel-services/state/actions';
    // #endregion external
// #endregion imports



// #region module
/**
 * Get current owner and return true if set.
 *
 * @param setViewOwnerID
 */
const getCurrentOwner = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
    const dispatchSetOwnedID: typeof actions.view.setViewOwnerID = (
        payload,
    ) => dispatch(
        actions.view.setViewOwnerID(payload),
    );
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const query = await client.query({
            query: GET_CURRENT_OWNER,
            fetchPolicy: 'no-cache',
        });

        const response = query.data.getCurrentOwner;

        if (!response.status) {
            return false;
        }

        const {
            id,
            analytics,
            projects,
            tokens,
            spaces,
            formats,
            notifiers,
            testers,
        } = graphql.deleteTypenames(response.data);

        const {
            entries,
            faults,
        } = analytics;

        dispatchSetOwnedID(id);
        dispatchDataAddEntities({
            type: 'analytics.entries',
            data: entries,
        });
        dispatchDataAddEntities({
            type: 'analytics.faults',
            data: faults,
        });
        dispatchDataAddEntities({
            type: 'projects',
            data: projects,
        });
        dispatchDataAddEntities({
            type: 'tokens',
            data: tokens,
        });
        dispatchDataAddEntities({
            type: 'spaces',
            data: spaces,
        });
        dispatchDataAddEntities({
            type: 'formats',
            data: formats,
        });
        dispatchDataAddEntities({
            type: 'notifiers',
            data: notifiers,
        });
        dispatchDataAddEntities({
            type: 'testers',
            data: testers,
        });

        return true;
    } catch (error) {
        return false;
    }
}


/**
 * Get current owner and return true if set.
 *
 * @param setViewUsageType
 */
const getUsageType = async (
    setViewUsageType: typeof actions.view.setViewUsageType,
) => {
    const query = await client.query({
        query: GET_USAGE_TYPE,
    });

    const response = query.data.getUsageType;

    if (response.status) {
        const usageType = response.data;
        setViewUsageType(usageType);

        switch (usageType) {
            case 'PRIVATE_USAGE':
                return 'private';
            case 'PUBLIC':
                return 'general';
            case 'CUSTOM_LOGIC':
                return 'general';
        }
    }

    return;
}


const getRecords = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    pagination?: InputQuery,
) => {
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const input = {
            count: pagination?.count,
            start: pagination?.start,
        };

        const query = await client.query({
            query: GET_RECORDS,
            fetchPolicy: 'no-cache',
            variables: {
                input,
            },
        });

        const response = query.data.getRecords;

        if (!response.status) {
            return false;
        }

        const records = graphql.deleteTypenames(response.data);

        dispatchDataAddEntities({
            type: 'records',
            data: records,
            push: pagination ? 'CONCATENATE' : '',
        });

        return true;
    } catch (error) {
        return false;
    }
}


const getTests = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const query = await client.query({
            query: GET_TESTS,
            fetchPolicy: 'no-cache',
        });

        const response = query.data.getTests;

        if (!response.status) {
            return false;
        }

        const tests = graphql.deleteTypenames(response.data);

        dispatchDataAddEntities({
            type: 'tests',
            data: tests,
        });

        return true;
    } catch (error) {
        return false;
    }
}
// #endregion module



// #region exports
export {
    getCurrentOwner,
    getUsageType,
    getRecords,
    getTests,
};
// #endregion exports
