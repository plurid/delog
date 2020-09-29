// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridSwitch,
        PluridFormLeftRight,
    } from '@plurid/plurid-ui-react';
    // #endregion libraries


    // #region internal
    import {
        StyledInputSwitch,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface InputSwitchProperties {
    name: string;
    checked: boolean;
    theme: any;
    atChange: () => void;

    compact?: boolean;
}

const InputSwitch: React.FC<InputSwitchProperties> = (
    properties,
) => {
    // #region properties
    const {
        name,
        checked,
        atChange,
        theme,

        compact,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <StyledInputSwitch
            compact={compact}
        >
            <PluridFormLeftRight>
                <div
                    style={{
                        marginLeft: '0.9rem',
                    }}
                >
                    {name}
                </div>

                <PluridSwitch
                    checked={checked}
                    level={2}
                    exclusive={true}
                    theme={theme}
                    atChange={() => atChange()}
                />
            </PluridFormLeftRight>
        </StyledInputSwitch>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default InputSwitch;
// #endregion exports
