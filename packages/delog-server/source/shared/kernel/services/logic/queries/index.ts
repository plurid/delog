// #region imports
    // #region libraries
    import { AnyAction } from 'redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        graphql,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import client from '#kernel-services/graphql/client';

    import {
        GET_CURRENT_OWNER,
        GET_USAGE_TYPE,
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
        projects,
        tokens,
        spaces,
        formats,
        notifiers,
        testers,
    } = graphql.deleteTypenames(response.data);

    dispatchSetOwnedID(id);
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
// #endregion module



// #region exports
export {
    getCurrentOwner,
    getUsageType,
};
// #endregion exports
