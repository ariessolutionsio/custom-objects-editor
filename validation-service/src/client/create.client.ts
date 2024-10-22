import fetch from 'node-fetch';
import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/ts-client';
import { readConfiguration } from '../utils/config.utils';
import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

const projectKey = readConfiguration().projectKey;
const scopes = [
  readConfiguration().scope ? (readConfiguration().scope as string) : 'default',
];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: `https://auth.${readConfiguration().region}.commercetools.com`,
  projectKey: projectKey,
  credentials: {
    clientId: readConfiguration().clientId,
    clientSecret: readConfiguration().clientSecret,
  },
  scopes,
  httpClient: fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: `https://api.${readConfiguration().region}.commercetools.com`,
  httpClient: fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

export const createApiRoot = ((root?: ByProjectKeyRequestBuilder) => () => {
  if (root) {
    return root;
  }

  root = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey: readConfiguration().projectKey,
  });

  return root;
})();
