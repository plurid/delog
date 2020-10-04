// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconStatistics,
        PluridIconLocked,
        PluridIconApps,
        PluridIconFrame,
        PluridIconEdit,
        PluridIconContact,
        PluridIconCommand,
        PluridIconInfo,
        PluridIconLink,
        PluridIconArrowRight,
        PluridIconDocuments,
        PluridIconExternalLink,
        PluridIconExit,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import delogLogo from '../../assets/delog-logo.png';

    import Project from '#kernel-components/Project';
    import Token from '#kernel-components/Token';
    import Space from '#kernel-components/Space';
    import Format from '#kernel-components/Format';
    import Notifier from '#kernel-components/Notifier';
    import Tester from '#kernel-components/Tester';
    // #endregion external


    // #region internal
    import AnalyticsView from './components/AnalyticsView';
    import TokensView from './components/TokensView';
    import ProjectsView from './components/ProjectsView';
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
    formats: PluridIconEdit,
    notifiers: PluridIconContact,
    testers: PluridIconCommand,
    records: PluridIconInfo,
    tests: PluridIconLink,
};


export const renderSelectedView = (
    stateIndexGeneralSelector: any,
    setGeneralView: any,
) => {
    switch (stateIndexGeneralSelector) {
        case 'analytics':
            return (
                <AnalyticsView
                    setGeneralView={setGeneralView}
                />
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
    stateGeneralTheme: any,
    stateInteractionTheme: any,
    stateIndexGeneralView: any,
    stateIndexGeneralSelector: any,
    stateViewCompactSelectors: any,
    stateViewUsageType: any,
    stateViewOwnerID: any,
    openManual: any,
    logout: any,
    findEntityByID: any,
    mouseOverSelectors: any,
    setMouseOverSelectors: any,
    setCompactSelectors: any,
    selectedView: any,
    setSelectedView: any,
    setGeneralView: any,
    dispatchAddEntity: any,
    dispatchViewSetEditID: any,
) => {
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

                                                <PluridIconExternalLink/>
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
