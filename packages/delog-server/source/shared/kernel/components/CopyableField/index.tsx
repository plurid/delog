// #region imports
    // #region libraries
    import React, {
        useRef,
        useState,
        useEffect,
    } from 'react';

    import {
        clipboard,
    } from '@plurid/plurid-functions';

    import {
        PluridIconCopy,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region internal
    import {
        StyledCopyableField,
        StyledData,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface CopyableFieldProperties {
    data: string,
}

const CopyableField: React.FC<CopyableFieldProperties> = (
    properties,
) => {
    // #region properties
    const {
        data,
    } = properties;
    // #endregion properties


    // #region references
    const mounted = useRef(true);
    // #endregion references


    // #region state
    const [
        showData,
        setShowData,
    ] = useState(true);
    // #endregion state


    // #region effects
    useEffect(() => {
        setTimeout(() => {
            if (!mounted.current) {
                return;
            }

            if (!showData) {
                setShowData(true);
            }
        }, 2000);
    }, [
        showData,
    ]);

    useEffect(() => {
        return () => {
            mounted.current = false;
        }
    }, []);
    // #endregion effects


    // #region render
    return (
        <StyledCopyableField>
            <PluridIconCopy
                atClick={() => {
                    clipboard.copy(data);
                    setShowData(false);
                }}
            />

            <StyledData>
                {showData ? (
                    <>
                        {data}
                    </>
                ) : (
                    <>
                        copied
                    </>
                )}
            </StyledData>
        </StyledCopyableField>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default CopyableField;
// #endregion exports
