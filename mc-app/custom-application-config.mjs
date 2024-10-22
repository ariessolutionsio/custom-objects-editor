import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */
const config = {
  name: 'Custom Objects Editor',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  mcApiUrl: '${env:MC_API_URL}',
  env: {
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
  },
  additionalEnv:{
    customObjectEndpoint: '${env:CUSTOM_OBJECT_ENDPOINT}',
  },
  headers: {
    csp: {
      'connect-src': [
        '${env:CUSTOM_OBJECT_ENDPOINT}',
      ],
      'script-src': [
        '${env:CUSTOM_OBJECT_ENDPOINT}',
      ],
    },
  },
  oAuthScopes: {
    view: [
      'view_products',
      'view_orders',
      'view_customers',
      'view_key_value_documents',
    ],
    manage: [
      'manage_products',
      'manage_orders',
      'manage_customers',
      'manage_key_value_documents',
    ],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Custom Objects Editor',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    // {
    //   defaultLabel: 'Custom Objects Editor List',
    //   uriPath: 'custom-objects',
    // },
    {
      defaultLabel: 'Container Schema Manager',
      uriPath: 'containers',
    },
  ],
};

export default config;
