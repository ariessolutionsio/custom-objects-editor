import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import {
  screen,
  mapResourceAccessToAppliedPermissions,
  type TRenderAppWithReduxOptions,
} from '@commercetools-frontend/application-shell/test-utils';
import { buildGraphqlList } from '@commercetools-test-data/core';
import type { CustomObject as T2CustomObject } from '@commercetools/platform-sdk';
import * as CustomObject from '../../test-utils';
import { renderApplicationWithRedux, TCustomObject } from '../../test-utils';
import { entryPointUriPath, PERMISSIONS } from '../../constants';
import { TQuery_CustomObjectsArgs } from '../../types/generated/ctp';
import { ContainerProvider } from '../../context/container-context';
import CustomObjectsList from './custom-objects-list';

const mockServer = setupServer(
  graphql.query<any, TQuery_CustomObjectsArgs>(
    'GetCustomObjects',
    (req, res, ctx) => {
      // Simulate a server side pagination.
      const { offset } = req.variables;
      const totalItems = 25; // 2 pages
      const itemsPerPage = offset === 0 ? 20 : 5;

      return res(
        ctx.data({
          customObjects: buildGraphqlList<T2CustomObject>(
            Array.from({ length: itemsPerPage }).map((_, index) => {
              const result = CustomObject.random().key(
                `custom-object-key-${offset === 0 ? index : 20 + index}`
              );
              return result;
            }),
            {
              name: 'CustomObject',
              total: totalItems,
            }
          ),
        })
      );
    }
  )
);
afterEach(() => {
  mockServer.restoreHandlers();
  mockServer.resetHandlers();
});
beforeAll(() => {
  mockServer.listen({
    // for debugging reasons we force an error when the test fires a request with a query or mutation which is not mocked
    // more: https://mswjs.io/docs/api/setup-worker/start#onunhandledrequest
    onUnhandledRequest: 'error',
  });
});
afterAll(() => {
  mockServer.close();
});

const renderApp = (
  options: Partial<TRenderAppWithReduxOptions> = {},
  items: Array<TCustomObject> = []
) => {
  const route = options.route || `/my-project/${entryPointUriPath}`;
  const { history } = renderApplicationWithRedux(
    items && items.length > 0 ? (
      <ContainerProvider results={items}>
        <CustomObjectsList />
      </ContainerProvider>
    ) : (
      <CustomObjectsList />
    ),
    {
      route,
      project: {
        allAppliedPermissions: mapResourceAccessToAppliedPermissions([
          PERMISSIONS.View,
        ]),
      },
      ...options,
    }
  );
  return { history };
};

const fetchCustomObjectsQueryHandlerWithError = graphql.query<
  any,
  TQuery_CustomObjectsArgs
>('GetCustomObjects', (req, res, ctx) => {
  return res.once(
    ctx.data({ customObjects: null }),
    ctx.errors([
      {
        message: 'Error.',
      },
    ])
  );
});

const fetchCustomObjectsQueryHandlerWithNullData = graphql.query<
  any,
  TQuery_CustomObjectsArgs
>('GetCustomObjects', (req, res, ctx) => {
  return res.once(
    ctx.data({
      customObjects: {
        __typename: 'CustomObjectQueryResult',
        count: 0,
        offset: 0,
        results: [],
        total: 0,
      },
    })
  );
});

describe('custom objects list', () => {
  it('should display title', async () => {
    renderApp();
    expect(await screen.findByTestId('title')).toBeInTheDocument();
  });
  it('should display subtitle', async () => {
    renderApp();
    expect(await screen.findByTestId('subtitle')).toBeInTheDocument();
  });
});

describe('when custom object query fails', () => {
  beforeEach(() => {
    mockServer.use(fetchCustomObjectsQueryHandlerWithError);
  });
  it('should display error message', async () => {
    renderApp();
    expect(await screen.findByTestId('loading-error')).toBeInTheDocument();
  });
  it('should not display custom object list', () => {
    renderApp();
    expect(screen.queryByTestId('custom-objects-list')).toBeNull();
  });
});

describe('when custom object query returns data', () => {
  it('should display result count', async () => {
    renderApp();
    expect(await screen.findByTestId('subtitle')).toBeInTheDocument();
  });

  it('should display custom object list', async () => {
    renderApp();
    expect(
      await screen.findByTestId('custom-objects-list')
    ).toBeInTheDocument();
  });
});

describe('when custom object returns an empty list', () => {
  beforeEach(() => {
    mockServer.use(fetchCustomObjectsQueryHandlerWithNullData);
  });

  it('should not display result count', async () => {
    renderApp();
    expect(await screen.findByTestId('title')).toBeInTheDocument();
    expect(screen.queryByTestId('subtitle')).toBeNull();
  });
  it('should not display custom object list', async () => {
    renderApp();
    expect(await screen.findByTestId('title')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-objects-list')).toBeNull();
  });
  it('should display error message', async () => {
    renderApp();
    expect(await screen.findByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('no-results-error')).not.toBeNull();
  });
});

describe('when container context has containers', () => {
  const amount = 1;
  const contextItems = buildGraphqlList<T2CustomObject>(
    Array.from({ length: amount }).map((_, index) => {
      const result = CustomObject.random().key(`custom-object-key-${index}`);
      return result;
    }),
    {
      name: 'CustomObject',
      total: amount,
    }
  ).results;
  it('should display container filter', async () => {
    renderApp(undefined, contextItems);
    expect(await screen.findByTestId('container-filter')).toBeInTheDocument();
  });

  it('should display key filter', async () => {
    renderApp(undefined, contextItems);
    expect(await screen.findByTestId('key-filter')).toBeInTheDocument();
  });

  it('should display create custom object button', async () => {
    renderApp(undefined, contextItems);
    expect(
      await screen.findByTestId('create-custom-object')
    ).toBeInTheDocument();
  });

  it('should not display no container error', async () => {
    renderApp(undefined, contextItems);
    expect(await screen.findByTestId('title')).toBeInTheDocument();
    expect(screen.queryByTestId('no-containers-error')).toBeNull();
  });
});

describe('when container context has no containers', () => {
  beforeEach(() => {
    mockServer.use(fetchCustomObjectsQueryHandlerWithNullData);
  });

  it('should not display container filter', async () => {
    renderApp();
    expect(await screen.findByTestId('title')).toBeInTheDocument();
    expect(screen.queryByTestId('container-filter')).toBeNull();
  });

  it('should not display create custom object button', async () => {
    renderApp();
    expect(await screen.findByTestId('title')).toBeInTheDocument();
    expect(screen.queryByTestId('create-custom-object')).toBeNull();
  });

  it('should display no container error', async () => {
    renderApp();
    expect(
      await screen.findByTestId('no-containers-error')
    ).toBeInTheDocument();
  });
});
