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
        PluridTextline,
        PluridPureButton,
        PluridSpinner,
    } from '@plurid/plurid-ui-react';

    import {
        PluridIconReset,
    } from '@plurid/plurid-icons-react';

    import {
        useThrottledCallback,
    } from '@plurid/plurid-functions-react';
    // #endregion libraries


    // #region internal
    import {
        StyledEntityView,
        StyledEntityViewTop,
        StyledTopButtons,
        StyledEntityListContainer,
        StyledEntityList,
        StyledEntityListItem,
        StyledActionButton,
        StyledNoRows,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface EntityViewProperties {
    // #region required
        // #region values
        generalTheme: Theme;
        interactionTheme: Theme;

        rowsHeader: JSX.Element;
        rowTemplate: string;
        rows: JSX.Element[];
        noRows: string;
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        entities?: any[];
        actionButtonText?: string;
        loading?: number;
        // #endregion values

        // #region methods
        actionButtonClick?: () => void;
        filterUpdate?: (
            value: any,
        ) => void;
        refresh?: () => void;

        actionScrollBottom?: (
            entities: any[],
        ) => void;
        // #endregion methods
    // #endregion optional
}

const EntityView: React.FC<EntityViewProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            generalTheme,
            interactionTheme,

            rowsHeader,
            rowTemplate,
            rows,
            noRows,
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values.
            entities,
            actionButtonText,
            loading,
            // #endregion values

            // #region methods
            actionButtonClick,
            filterUpdate,
            refresh,
            actionScrollBottom,
            // #endregion methods
        // #endregion optional
    } = properties;
    // #endregion properties


    // #region references
    const bottomTimeout = useRef<number | null>();
    const entityList = useRef<HTMLUListElement | null>(null);
    // #endregion references


    // #region state
    const [
        searchValue,
        setSearchValue,
    ] = useState('');
    const [
        refreshClicked,
        setRefreshClicked,
    ] = useState(false);
    // #endregion state


    // #region handlers
    const handleScroll = useThrottledCallback(() => {
        const element = entityList.current;

        if (!element) {
            return;
        }

        const scrolledAmount = element.scrollTop + element.getBoundingClientRect().height
        const bottomReached = scrolledAmount >= element.scrollHeight;

        if (bottomReached && actionScrollBottom && entities) {
            actionScrollBottom(entities);
        }
    }, 1000);
    // #endregion handlers


    // #region effects
    useEffect(() => {
        if (refreshClicked) {
            setTimeout(() => {
                setRefreshClicked(false);
            }, 1500);
        }
    }, [
        refreshClicked,
    ]);

    /**
     * Action at Bottom of List.
     */
    useEffect(() => {
        bottomTimeout.current = setTimeout(() => {
            if (entityList.current && actionScrollBottom) {
                entityList.current.addEventListener('scroll', handleScroll);
            }
        }, 100);

        return () => {
            if (bottomTimeout.current) {
                clearTimeout(bottomTimeout.current);
            }

            if (entityList.current && actionScrollBottom) {
                entityList.current.removeEventListener('scroll', handleScroll);
            }
        }
    }, [
        entities,
    ]);
    // #endregion effects


    // #region render
    return (
        <StyledEntityView
            theme={generalTheme}
        >
            {loading
            && (
                <PluridSpinner
                    theme={generalTheme}
                />
            )}

            <StyledEntityViewTop>
                <div>
                    <PluridTextline
                        text={searchValue}
                        placeholder="filter"
                        atChange={(event) => {
                            const {
                                value,
                            } = event.target;

                            setSearchValue(value);

                            if (filterUpdate) {
                                filterUpdate(value);
                            }
                        }}
                        theme={interactionTheme}
                        spellCheck={false}
                        autoCapitalize="false"
                        autoComplete="false"
                        autoCorrect="false"
                        level={2}
                        style={{
                            width: '300px',
                        }}
                    />
                </div>

                <StyledTopButtons>
                    {refresh
                    && !refreshClicked
                    && (
                        <PluridIconReset
                            atClick={() => {
                                setRefreshClicked(true);
                                refresh();
                            }}
                            theme={generalTheme}
                        />
                    )}
                </StyledTopButtons>
            </StyledEntityViewTop>

            {rows.length === 0 && (
                <StyledNoRows>
                    {noRows}
                </StyledNoRows>
            )}

            {rows.length !== 0 && (
                <StyledEntityListContainer
                    theme={generalTheme}
                >
                    <StyledEntityList
                        theme={generalTheme}
                        header={true}
                    >
                        <StyledEntityListItem
                            rowTemplate={rowTemplate}
                        >
                            {rowsHeader}
                        </StyledEntityListItem>
                    </StyledEntityList>

                    <StyledEntityList
                        theme={generalTheme}
                        ref={entityList}
                        loading={loading}
                    >
                        {rows.map(row => {
                            return (
                                <StyledEntityListItem
                                    key={Math.random() + ''}
                                    rowTemplate={rowTemplate}
                                >
                                    {row}
                                </StyledEntityListItem>
                            );
                        })}
                    </StyledEntityList>
                </StyledEntityListContainer>
            )}

            {actionButtonText && (
                <StyledActionButton>
                    <PluridPureButton
                        text={actionButtonText}
                        atClick={() => actionButtonClick
                            ? actionButtonClick() : undefined
                        }
                        theme={interactionTheme}
                        level={2}
                    />
                </StyledActionButton>
            )}
        </StyledEntityView>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default EntityView;
// #endregion exports
