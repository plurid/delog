// #region imports
    // #region libraries
    import React from 'react';

    import {
        hydrateRoot,
    } from 'react-dom/client';
    // #endregion libraries


    // #region internal
    import Client from './Client';
    // #endregion internal
// #endregion imports



// #region module
/** Uncomment to use the service worker caching the static vendor.js and favicons */
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/service-worker.js');
// }

const delogApp = document.getElementById('delog-application')!;


hydrateRoot(
    delogApp,
    <Client />,
);
// #endregion module
