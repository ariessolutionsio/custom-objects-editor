import { PERMISSIONS } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */
const config = {
  name: 'Custom Objects Editor',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
    development: {
      initialProjectKey: '${env:INITIAL_PROJECT_KEY}',
    },
  },
  oAuthScopes: {
    view: [
      'view_categories',
      'view_cart_discounts',
      'view_customer_groups',
      'view_customers',
      'view_discount_codes',
      'view_key_value_documents',
      'view_orders',
      'view_payments',
      'view_products',
      'view_shipping_methods',
      'view_shopping_lists',
      'view_standalone_prices',
      'view_states',
      'view_stores',
      'view_tax_categories',
      'view_types',
    ],
    manage: [
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
    {
      defaultLabel: 'Custom Objects Editor',
      uriPath: '/',
    },
    {
      defaultLabel: 'Container Schema Manager',
      uriPath: 'containers',
    },
  ],
};

export default config;
