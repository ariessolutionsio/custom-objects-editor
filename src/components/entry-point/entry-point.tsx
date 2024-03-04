import React, { lazy, useEffect } from 'react';
import {
  ApplicationShell,
  setupGlobalErrorListener,
} from '@commercetools-frontend/application-shell';
import type { ApplicationWindow } from '@commercetools-frontend/constants';
import loadMessages from '../../load-messages';

declare let window: ApplicationWindow;

// Here we split up the main (app) bundle with the actual application business logic.
// Splitting by route is usually recommended and you can potentially have a splitting
// point for each route. More info at https://reactjs.org/docs/code-splitting.html
const AsyncApplicationRoutes = lazy(
  () => import('../../routes' /* webpackChunkName: "routes" */)
);

// Ensure to setup the global error listener before any React component renders
// in order to catch possible errors on rendering/mounting.
setupGlobalErrorListener();

const EntryPoint = () => {

  useEffect(() => {
    const ariesLogoElement = document.createElement('div');
    const anchor = document.createElement('a');
    const img = document.createElement('img');
    img.src = 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1705673742/kkepkrfkpmxqz52cg9ns.png';
    img.alt='aries-logo';
    img.style.width = 'inherit';
    img.style.height = '32px';
    img.style.marginLeft = '10px';
    anchor.href = '/aries_dev-1';
    anchor.appendChild(img);
    ariesLogoElement.appendChild(anchor);
    const parent = document.getElementById('loader-for-requests-in-flight')?.parentElement;
    const loaderElement = document.getElementById('loader-for-requests-in-flight');
    parent?.insertBefore(ariesLogoElement, loaderElement);
  },[]);
  
  return (
    <ApplicationShell environment={window.app} applicationMessages={loadMessages}>
      <AsyncApplicationRoutes />
    </ApplicationShell>
  );
};
EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
