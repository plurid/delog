// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import {
        notificationTypes,
    } from '#server/data/constants/notifier';

    import InputSwitch from '#kernel-components/InputSwitch';
    // #endregion external


    // #region internal
    import {
        StyledNotifyOn,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface NotifyOnProperties {
    theme: any;
    selected: string[];
    select: (
        element: string,
    ) => void;
}

const NotifyOn: React.FC<NotifyOnProperties> = (
    properties,
) => {
    // #region properties
    const {
        theme,
        selected,
        select,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <StyledNotifyOn>
            <div
                style={{
                    marginLeft: '0.9rem',
                }}
            >
                notify on
            </div>

            <ul>
                {Object.values(notificationTypes).map(field => {
                    const fieldText = field
                        .toLowerCase()
                        .replace('_', ' ');

                    return (
                        <li
                            key={field}
                        >
                            <InputSwitch
                                name={fieldText}
                                checked={selected.includes(field)}
                                theme={theme}
                                atChange={() => select(field)}

                                compact={true}
                            />
                        </li>
                    );
                })}
            </ul>
        </StyledNotifyOn>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default NotifyOn;
// #endregion exports
