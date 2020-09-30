// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region internal
    import {
        StyledSelectors,
        StyledSelector,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface SelectorsProperties {
    theme: any;
    selected: string;
    selectables: string[];
    select: (
        element: string,
    ) => void;
}

const Selectors: React.FC<SelectorsProperties> = (
    properties,
) => {
    // #region properties
    const {
        theme,
        selected,
        selectables,
        select,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <StyledSelectors>
            {selectables.map(selectable => {
                return (
                    <StyledSelector
                        key={selectable}
                        theme={theme}
                        selected={selected === selectable}
                        onClick={() => select(selectable)}
                    >
                        {selectable}
                    </StyledSelector>
                );
            })}
        </StyledSelectors>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Selectors;
// #endregion exports
