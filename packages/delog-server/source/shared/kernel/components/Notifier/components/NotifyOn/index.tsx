// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import InputSwitch from '#kernel-components/InputSwitch';
    // #endregion external


    // #region internal
    import {
        StyledNotifyOn,
    } from './styled';
    // #endregion internal
// #endregion imports



const fields = [
    'ENTITY_REGISTRATION',
    'ENTITY_DEREGISTRATION',
    'RECORDED_FATAL',
    'RECORDED_ERROR',
    'RECORDED_WARN',
    'TEST_FAIL',
    'TEST_SUCCESS',
];

// #region module
export interface NotifyOnProperties {
    theme: any;
    selected: string[];
    select: (element: string) => void;
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
                {fields.map(field => {
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
