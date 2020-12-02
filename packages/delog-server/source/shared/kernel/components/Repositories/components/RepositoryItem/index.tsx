// #region imports
    // #region libraries
    import React from 'react';

    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        PluridIconValid,
        PluridIconLocked,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        Repository as IRepository,
    } from '~server/data/interfaces';
    // #endregion external


    // #region internal
    import {
        StyledRepositoryItem,
        StyledRepositoryIcon,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface RepositoryItemProperties {
    // #region required
        // #region values
        theme: Theme;
        data: IRepository;
        selected: boolean;
        // #endregion values

        // #region methods
        select: (
            id: string,
        ) => void;
        // #endregion methods
    // #endregion required

    // #region optional
        // #region values
        // #endregion values

        // #region methods
        // #endregion methods
    // #endregion optional
}

const RepositoryItem: React.FC<RepositoryItemProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            theme,
            data,
            selected,
            // #endregion values

            // #region methods
            select,
            // #endregion methods
        // #endregion required

        // #region optional
            // #region values
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion optional
    } = properties;

    const {
        id,
        name,
        isPrivate,
    } = data;
    // #endregion properties


    // #region render
    return (
        <StyledRepositoryItem
            theme={theme}
            onClick={() => select(id)}
        >
            <StyledRepositoryIcon>
                {selected && (
                    <PluridIconValid />
                )}
            </StyledRepositoryIcon>

            <div>
                {name}
            </div>

            <StyledRepositoryIcon>
                {isPrivate && (
                    <PluridIconLocked />
                )}
            </StyledRepositoryIcon>
        </StyledRepositoryItem>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RepositoryItem;
// #endregion exports
