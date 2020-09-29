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
export const dataRender = (
    type: string,
    data: string,
) => {
    const parsed = JSON.parse(data);

    try {
        switch (type) {
            case 'api':
                return (
                    <>
                        <div>
                            endpoint: {parsed.endpoint}
                        </div>
                    </>
                );
            case 'email':
                return (
                    <>
                        <div>
                            notify to: {parsed.notifyTo.map((notifyTo: string) => {
                                return (
                                    <div
                                        key={notifyTo}
                                    >
                                        {notifyTo}
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            host: {parsed.authentication.host}
                        </div>
                        <div>
                            port: {parsed.authentication.port}
                        </div>
                        <div>
                            secure: {parsed.authentication.secure}
                        </div>
                        <div>
                            username: {parsed.authentication.username}
                        </div>
                        <div>
                            sender: {parsed.authentication.sender}
                        </div>
                    </>
                );
            default:
                return (
                    <></>
                );
        }
    } catch (error) {
        return (
            <></>
        );
    }
}


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
        notifyOn,
        data,
    } = notifier;

    return (
        <>
            <div>
                {type}
            </div>

            <div>
                {name}
            </div>

            <div>
                {notifyOn.map(notification => {
                    const notificationText = notification.toLowerCase().replace('_', ' ');

                    return (
                        <div
                            key={notification}
                            style={{
                                marginBottom: '0.3rem',
                            }}
                        >
                            {notificationText}
                        </div>
                    );
                })}
            </div>

            <div>
                {
                    dataRender(
                        type,
                        data as any,
                    )
                }
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
