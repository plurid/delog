// #region imports
    // #region libraries
    import React from 'react';

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

    // #region render
    return (
        <StyledCopyableField>
            <PluridIconCopy
                atClick={() => clipboard.copy(data)}
                style={{
                    marginRight: '1rem',
                }}
            />

            {data}
        </StyledCopyableField>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default CopyableField;
// #endregion exports
