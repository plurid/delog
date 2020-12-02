// #region imports
    // #region libraries
    import React from 'react';

    import { AnyAction } from 'redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        PluridIconStatistics,
        PluridIconLocked,
        PluridIconApps,
        PluridIconFrame,
        PluridIconToolbox,
        PluridIconRepository,
        PluridIconEdit,
        PluridIconContact,
        PluridIconCommand,
        PluridIconInfo,
        PluridIconNewStateline,
        PluridIconArrowRight,
        PluridIconDocuments,
        PluridIconExternalLink,
        PluridIconExit,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import delogLogo from '../../assets/delog-logo.png';

    import Token from '~kernel-components/Token';
    import Project from '~kernel-components/Project';
    import Space from '~kernel-components/Space';
    import Provider from '~kernel-components/Provider';
    import Repositories from '~kernel-components/Repositories';
    import Format from '~kernel-components/Format';
    import Notifier from '~kernel-components/Notifier';
    import Tester from '~kernel-components/Tester';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    import actions from '~kernel-services/state/actions';
    // #endregion external


    // #region internal
    import AnalyticsView from './components/AnalyticsView';
    import TokensView from './components/TokensView';
    import ProjectsView from './components/ProjectsView';
    import ProvidersView from './components/ProvidersView';
    import RepositoriesView from './components/RepositoriesView';
    import SpacesView from './components/SpacesView';
    import FormatsView from './components/FormatsView';
    import NotifiersView from './components/NotifiersView';
    import TestersView from './components/TestersView';
    import RecordsView from './components/RecordsView';
    import TestsView from './components/TestsView';

    import {
        StyledGeneralView,
        StyledGeneralSelectors,
        StyledGeneralSelectorItem,
        StyledGeneralPeformer,
        StyledGeneralHelp,
        StyledGeneralHelpItem,
        StyledGeneralSelected,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export const generalSelectors = [
    'analytics',
    'tokens',
    'projects',
    'spaces',
    'providers',
    'repositories',
    'formats',
    'notifiers',
    'testers',
    'records',
    'tests',
];

export const generalSelectorsIcons = {
    analytics: PluridIconStatistics,
    tokens: PluridIconLocked,
    projects: PluridIconApps,
    spaces: PluridIconFrame,
    providers: PluridIconToolbox,
    repositories: PluridIconRepository,
    formats: PluridIconEdit,
    notifiers: PluridIconContact,
    testers: PluridIconCommand,
    records: PluridIconInfo,
    tests: PluridIconNewStateline,
};


export const renderSelectedView = (
    stateIndexGeneralSelector: any,
    setGeneralView: any,
) => {
    switch (stateIndexGeneralSelector) {
        case 'analytics':
            return (
                <AnalyticsView />
            );
        case 'tokens':
            return (
                <TokensView
                    setGeneralView={setGeneralView}
                />
            );
        case 'projects':
            return (
                <ProjectsView
                    setGeneralView={setGeneralView}
                />
            );
        case 'providers':
            return (
                <ProvidersView
                    setGeneralView={setGeneralView}
                />
            );
        case 'repositories':
            return (
                <RepositoriesView
                    setGeneralView={setGeneralView}
                />
            );
        case 'spaces':
            return (
                <SpacesView
                    setGeneralView={setGeneralView}
                />
            );
        case 'formats':
            return (
                <FormatsView
                    setGeneralView={setGeneralView}
                />
            );
        case 'notifiers':
            return (
                <NotifiersView
                    setGeneralView={setGeneralView}
                />
            );
        case 'testers':
            return (
                <TestersView
                    setGeneralView={setGeneralView}
                />
            );
        case 'records':
            return (
                <RecordsView
                    setGeneralView={setGeneralView}
                />
            );
        case 'tests':
            return (
                <TestsView
                    setGeneralView={setGeneralView}
                />
            );
        default:
            return (<></>);
    }
}


export const renderGeneralView = (
    state: AppState,
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    openManual: any,
    logout: any,
    findEntityByID: any,
    mouseOverSelectors: any,
    setMouseOverSelectors: any,
    setCompactSelectors: any,
    selectedView: any,
    setSelectedView: any,
    setGeneralView: any,
) => {
    const stateGeneralTheme = selectors.themes.getGeneralTheme(state);
    const stateInteractionTheme = selectors.themes.getInteractionTheme(state);
    const stateIndexGeneralSelector = selectors.view.getIndexGeneralSelector(state);
    const stateIndexGeneralView = selectors.view.getIndexGeneralView(state);
    const stateViewCompactSelectors = selectors.view.getViewCompactSelectors(state);
    const stateViewOwnerID = selectors.view.getViewOwnerID(state);
    const stateViewUsageType = selectors.view.getViewUsageType(state);
    const stateViewActiveProviderID = selectors.data.getActiveProviderID(state);

    const dispatchAddEntity = (
        payload: any,
    ) => dispatch(
        actions.data.addEntity(payload),
    );
    // const dispatchViewSetEditID = (
    //     payload: any,
    // ) => dispatch (
    //     actions.view.setEditID(payload),
    // );


    switch (stateIndexGeneralView) {
        case 'general':
            return (
                <StyledGeneralView
                    compactSelectors={stateViewCompactSelectors}
                >
                    <StyledGeneralSelectors
                        onMouseEnter={() => setMouseOverSelectors(true)}
                        onMouseLeave={() => setMouseOverSelectors(false)}
                        theme={stateGeneralTheme}
                        compactSelectors={stateViewCompactSelectors}
                        viewUsageType={stateViewUsageType}
                    >
                        <StyledGeneralPeformer
                            compactSelectors={stateViewCompactSelectors}
                        >
                            {!stateViewCompactSelectors && (
                                <>
                                    <div>
                                        <img
                                            src={delogLogo}
                                            alt="delog"
                                            height={30}
                                            onClick={() => setCompactSelectors(true)}
                                        />
                                    </div>

                                    <div>
                                        delog
                                    </div>
                                </>
                            )}

                            {stateViewCompactSelectors
                            && mouseOverSelectors
                            && (
                                <PluridIconArrowRight
                                    atClick={() => setCompactSelectors(false)}
                                />
                            )}
                        </StyledGeneralPeformer>

                        <ul>
                            {generalSelectors.map(selector => {
                                const Icon = generalSelectorsIcons[selector];

                                return (
                                    <StyledGeneralSelectorItem
                                        key={selector}
                                        onClick={() => setSelectedView(selector)}
                                        theme={stateGeneralTheme}
                                        selected={selector === stateIndexGeneralSelector}
                                        compactSelectors={stateViewCompactSelectors}
                                    >
                                        <Icon />

                                        {!stateViewCompactSelectors && (
                                            <div>
                                                {selector}
                                            </div>
                                        )}
                                    </StyledGeneralSelectorItem>
                                );
                            })}
                        </ul>

                        <StyledGeneralHelp>
                            {mouseOverSelectors && (
                                <ul>
                                    <StyledGeneralHelpItem
                                        onClick={() => openManual()}
                                        compactSelectors={stateViewCompactSelectors}
                                    >
                                        <PluridIconDocuments />

                                        {!stateViewCompactSelectors && (
                                            <>
                                                <div>
                                                    manual
                                                </div>

                                                <PluridIconExternalLink />
                                            </>
                                        )}
                                    </StyledGeneralHelpItem>

                                    {stateViewUsageType === 'PRIVATE_USAGE' && (
                                        <StyledGeneralHelpItem
                                            onClick={() => logout()}
                                            compactSelectors={stateViewCompactSelectors}
                                        >
                                            <PluridIconExit />

                                            {!stateViewCompactSelectors && (
                                                <>
                                                    <div>
                                                        logout ({stateViewOwnerID})
                                                    </div>

                                                    <div />
                                                </>
                                            )}
                                        </StyledGeneralHelpItem>
                                    )}
                                </ul>
                            )}
                        </StyledGeneralHelp>
                    </StyledGeneralSelectors>

                    <StyledGeneralSelected>
                        {selectedView}
                    </StyledGeneralSelected>
                </StyledGeneralView>
            );
        case 'generate-token':
            return (
                <Token
                    theme={stateInteractionTheme}
                    action={(token) => {
                        dispatchAddEntity({
                            type: 'token',
                            data: token,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'generate-project':
            return (
                <Project
                    theme={stateInteractionTheme}
                    action={(project) => {
                        dispatchAddEntity({
                            type: 'project',
                            data: project,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'generate-space':
            return (
                <Space
                    theme={stateInteractionTheme}
                    action={(space) => {
                        dispatchAddEntity({
                            type: 'space',
                            data: space,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'add-provider':
            return (
                <Provider
                    theme={stateInteractionTheme}
                    action={(provider) => {
                        dispatchAddEntity({
                            type: 'provider',
                            data: provider,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'link-repositories':
            return (
                <Repositories
                    theme={stateInteractionTheme}
                    providerID={stateViewActiveProviderID}
                    action={(repositories) => {
                        for (const repository of repositories) {
                            dispatchAddEntity({
                                type: 'repository',
                                data: repository,
                            });
                        }

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'generate-format':
            return (
                <Format
                    theme={stateInteractionTheme}
                    action={(format) => {
                        dispatchAddEntity({
                            type: 'format',
                            data: format,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'generate-notifier':
            return (
                <Notifier
                    theme={stateInteractionTheme}
                    action={(notifier) => {
                        dispatchAddEntity({
                            type: 'notifier',
                            data: notifier,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'generate-tester':
            return (
                <Tester
                    theme={stateInteractionTheme}
                    action={(tester) => {
                        dispatchAddEntity({
                            type: 'tester',
                            data: tester,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        default:
            return (
                <></>
            );
    }
}
// #endregion module
