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
    } from '~server/data/interfaces';
    // #endregion external


    // #region internal
    import {
        StyledDetailLine,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export const dataRender = (
    type: string,
    data: string,
) => {
    try {
        const parsed = JSON.parse(data);

        switch (type) {
            case 'api':
                return (
                    <>
                        <StyledDetailLine>
                            endpoint
                            <br/>
                            {parsed.endpoint}
                        </StyledDetailLine>
                    </>
                );
            case 'email':
                return (
                    <>
                        <StyledDetailLine>
                            notify to
                            {parsed.notifyTo.map((notifyTo: string) => {
                                return (
                                    <div
                                        key={notifyTo}
                                    >
                                        {notifyTo}
                                    </div>
                                );
                            })}
                        </StyledDetailLine>

                        <StyledDetailLine>
                            host
                            <br/>
                            {parsed.authentication.host}
                        </StyledDetailLine>

                        <StyledDetailLine>
                            port
                            <br/>
                            {parsed.authentication.port}
                        </StyledDetailLine>

                        <StyledDetailLine>
                            secure
                            <br/>
                            {parsed.authentication.secure ? 'true' : 'false'}
                        </StyledDetailLine>

                        <StyledDetailLine>
                            username
                            <br/>
                            {parsed.authentication.username}
                        </StyledDetailLine>

                        <StyledDetailLine>
                            sender
                            <br/>
                            {parsed.authentication.sender}
                        </StyledDetailLine>
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
