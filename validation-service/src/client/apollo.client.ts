import { DocumentNode, print } from 'graphql';
import { readConfiguration } from '../utils/config.utils';

// Get token using client credentials flow
async function getAccessToken() {
  const config = readConfiguration();
  const response = await fetch(
    `https://auth.${config.region}.commercetools.com/oauth/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${config.clientId}:${config.clientSecret}`
        ).toString('base64')}`,
      },
      body: `grant_type=client_credentials&scope=${config.scope}`,
    }
  );

  const data = await response.json();
  return data.access_token;
}

const config = readConfiguration();

export const getNodeClient = async () => {
  const accessToken = await getAccessToken();
  return {
    query: async ({
      query,
      variables,
    }: {
      query: DocumentNode;
      variables?: Record<string, any>;
    }) => {
      const response = await fetch(
        `https://api.${config.region}.commercetools.com/${config.projectKey}/graphql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            query: print(query),
            variables,
          }),
        }
      );

      const data = await response.json();
      return data;
    },
  };
};
