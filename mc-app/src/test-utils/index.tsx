import type { ReactElement } from 'react';
import { createApolloClient } from '@commercetools-frontend/application-shell';
import {
  renderApp,
  renderAppWithRedux,
  type TRenderAppOptions,
  type TRenderAppWithReduxOptions,
} from '@commercetools-frontend/application-shell/test-utils';
import kebabCase from 'lodash/kebabCase';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import times from 'lodash/times';
import faker from 'faker';
import { entryPointUriPath, CONTAINER, REFERENCE_BY,
  REFERENCE_TYPES,
  TYPES, } from '../constants';
import ApplicationRoutes from '../routes';
import { getAttributeValues } from '../form-utils';

const mergeWithDefaultOptions = (
  options: Partial<TRenderAppOptions> | Partial<TRenderAppWithReduxOptions> = {}
): Partial<TRenderAppOptions> | Partial<TRenderAppWithReduxOptions> => ({
  ...options,
  environment: {
    ...(options.environment || {}),
    entryPointUriPath,
  },
  apolloClient: createApolloClient(),
});

export const generateAttribute = ({
  type = faker.random.arrayElement(Object.values(TYPES)),
  display = faker.random.boolean(),
  displayNested = faker.random.boolean(),
  set = faker.random.boolean(),
  languages = times(2, () => faker.random.locale()),
}) => {
  const generateAttributes = (display = faker.random.boolean()): any =>
    times(faker.random.number({ min: 1, max: 5 }), () =>
      generateAttribute({ display })
    );
  return {
    name: faker.random.words(),
    type,
    set,
    required: faker.random.boolean(),
    display,
    ...(type === TYPES.Object && {
      attributes: generateAttributes(displayNested),
    }),
    ...(type === TYPES.Reference && {
      reference: {
        by: faker.random.arrayElement(Object.values(REFERENCE_BY)),
        type: faker.random.arrayElement(Object.values(REFERENCE_TYPES)),
      },
    }),
    ...(type === TYPES.Enum && {
      enum: times(2, () => ({
        value: JSON.stringify(faker.random.number()),
        label: faker.random.words(),
      })),
    }),
    ...(type === TYPES.LocalizedEnum && {
      lenum: times(2, () => ({
        value: JSON.stringify(faker.random.number()),
        label: reduce(
          languages,
          (label, language) => ({ ...label, [language]: faker.random.words() }),
          {}
        ),
      })),
    }),
  };
};

const generateAttributes = (display = faker.random.boolean()): any =>
  times(faker.random.number({ min: 1, max: 5 }), () =>
    generateAttribute({ display })
  );

export const generateContainer = (attributes = generateAttributes()) => ({
  id: faker.random.uuid(),
  version: faker.random.number({ min: 1, max: 10 }),
  container: CONTAINER,
  key: kebabCase(faker.random.words()),
  value: {
    attributes,
  },
  lastModifiedAt: faker.date.recent(),
});

export const generateContainers = (
  total = faker.random.number({ min: 1, max: 10 })
) => ({
  customObjects: {
    count: total,
    total,
    offset: 0,
    results: times(total, generateContainer),
  },
});

export const generateFormValues = () => ({
  key: kebabCase(faker.random.words()),
  attributes: times(3, () => ({
    name: faker.random.word(),
    type: faker.random.arrayElement(Object.values(TYPES)),
    required: faker.random.boolean(),
    set: faker.random.boolean(),
  })),
});

export const generateCustomObject = (
  container = generateContainer(),
  currencies = times(2, () => faker.finance.currencyCode()),
  languages: Array<string> = times(2, faker.random.locale())
) => ({
  id: faker.random.uuid(),
  version: faker.random.number({ min: 1, max: 10 }),
  container: container.key,
  key: kebabCase(faker.random.words()),
  lastModifiedAt: faker.date.recent(),
  value: getAttributeValues(container.value.attributes, currencies, languages),
});

export const generateContainerContext = (
  containers = generateContainers(2).customObjects.results
) => {
  return {
    hasContainers: true,
    containers,
    where: `container in (${map(containers, ({ key }) => `"${key}"`).join(
      ','
    )})`,
  };
};

const renderApplication = (
  ui: ReactElement,
  options: Partial<TRenderAppOptions>
) => renderApp(ui, mergeWithDefaultOptions(options));

const renderApplicationWithRedux = (
  ui: ReactElement,
  options: Partial<TRenderAppWithReduxOptions>
) => renderAppWithRedux(ui, mergeWithDefaultOptions(options));

const renderApplicationWithRoutes = (options: Partial<TRenderAppOptions>) =>
  renderApplication(<ApplicationRoutes />, options);

const renderApplicationWithRoutesAndRedux = (
  options: Partial<TRenderAppWithReduxOptions>
) => renderApplicationWithRedux(<ApplicationRoutes />, options);

export {
  renderApplication,
  renderApplicationWithRedux,
  renderApplicationWithRoutes,
  renderApplicationWithRoutesAndRedux,
};

export { default as random } from './builder';
export * from './types';
