// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridIconDelete,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import {
        ClientNotifier,
    } from '#server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const notifierRowRenderer = (
    notifier: ClientNotifier,
    handleNotifierObliterate: (
        id: string,
    ) => void,
) => {
    const {
        id,
        name,
        type,
    } = notifier;

    return (
        <>
            <div>
                {type}
            </div>

            <div>
                {name}
            </div>

            <PluridIconDelete
                atClick={() => handleNotifierObliterate(id)}
            />
        </>
    );
}


export const createSearchTerms = (
    notifiers: ClientNotifier[],
) => {
    const searchTerms = notifiers.map(
        notifier => {
            const {
                id,
                name,
                type,
            } = notifier;

            const searchTerm = {
                id,
                data: [
                    name.toLowerCase(),
                    type.toLowerCase(),
                ],
            };

            return searchTerm;
        },
    );

    return searchTerms;
}
// #endregion module
