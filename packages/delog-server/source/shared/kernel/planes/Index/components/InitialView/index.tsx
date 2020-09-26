// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridPureButton,
    } from '@plurid/plurid-ui-react';
    // #endregion libraries


    // #region external
    import performerLogo from '../../assets/performer-logo.png';
    // #endregion external


    // #region internal
    import {
        StyledInitialView,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface InitialViewProperties {
}

const InitialView: React.FC<InitialViewProperties> = (
    properties,
) => {
    // #region properties
    // const {
    // } = properties;
    // #endregion properties


    // #region render
    return (
        <StyledInitialView>
            <div>
                <img
                    src={performerLogo}
                    alt="performer logo"
                    height={250}
                />
            </div>

            <h1>
                performer
            </h1>

            <h2>
                Cloud-Native Continuous Integration/Continuous Delivery Build Pipeline
            </h2>

            <div
                style={{
                    width: '200px',
                    margin: '50px auto',
                }}
            >
                <PluridPureButton
                    text="Initial Setup"
                    atClick={() => {
                        // setView('setup');
                    }}
                    level={2}
                />
            </div>
        </StyledInitialView>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default InitialView;
// #endregion exports
