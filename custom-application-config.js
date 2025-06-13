// eslint-disable-next-line import/extensions
import { PERMISSIONS, entryPointUriPath } from './src/constants.ts';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */
const config = {
  name: 'Custom Objects Editor',
  entryPointUriPath,
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
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
  headers: {
    csp: {
      'script-src': ['https://upload-widget.cloudinary.com'],
      'connect-src': ['https://api.cloudinary.com'],
      'img-src': ['res.cloudinary.com'],
      'frame-src': [
        'https://widget.cloudinary.com',
        'https://upload-widget.cloudinary.com',
        'https://www.facebook.com',
        'https://www.instagram.com',
      ],
    },
  },
  additionalEnv: {
    logoMustBeVisible: '${env:LOGO_MUST_BE_VISIBLE}',
    cloudinaryCloudName: '${env:MC_APP_CLOUDINARY_CLOUD_NAME}',
    cloudinaryUploadPreset: '${env:MC_APP_CLOUDINARY_UPLOAD_PRESET}',
    cloudinaryEnabled: '${env:MC_APP_CLOUDINARY_ENABLED}',
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
