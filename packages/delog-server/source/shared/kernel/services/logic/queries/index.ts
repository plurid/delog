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
        GET_SETUP,
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
    setViewOwnerID: typeof actions.view.setViewOwnerID,
) => {
    const query = await client.query({
        query: GET_CURRENT_OWNER,
    });

    const response = query.data.getCurrentOwner;

    if (response.status) {
        const owner = graphql.deleteTypenames(
            response.data,
        );

        setViewOwnerID(owner.id);
        return true;
    }

    return;
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


/**
 * Get data.
 *
 * @param dispatch
 */
const getSetup = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
    const dispatchSetActiveProviderID: typeof actions.data.setActiveProviderID = (
        providerID,
    ) => dispatch(
        actions.data.setActiveProviderID(providerID),
    );

    const dispatchSetProjects: typeof actions.data.setProjects = (
        projects,
    ) => dispatch(
        actions.data.setProjects(projects),
    );


    const setupQuery = await client.query({
        query: GET_SETUP,
        fetchPolicy: 'no-cache',
    });

    const response = setupQuery.data.getSetup;

    if (!response.status) {
        return;
    }

    const {

        projects,
    } = graphql.deleteTypenames(response.data);

    dispatchSetProjects(projects);
}
// #endregion module



// #region exports
export {
    getCurrentOwner,
    getUsageType,
    getSetup,
};
// #endregion exports
