/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApolloClient } from '@commercetools-frontend/application-shell';

import { ApolloError, ApolloQueryResult } from '@apollo/client';
import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { extractErrorFromGraphQlResponse } from '../../helpers';
import {
  TCustomObjectDraft,
  TMutation,
  TMutation_DeleteCustomObjectArgs,
  TQuery,
  TQuery_CustomObjectArgs,
  TQuery_CustomObjectsArgs,
} from '../../types/generated/ctp';
import DeleteCustomObject from './delete-custom-object.rest.graphql';
import GetCustomObject from './get-custom-object.rest.graphql';
import GetCustomObjects from './get-custom-objects.ctp.graphql';
import { CustomObjectController } from '../../shared-code';
import { GraphQLClient } from '../../shared-code/types/graphql';

type TUseCustomObjectsFetcher = (variables: TQuery_CustomObjectsArgs) => {
  customObjectsPaginatedResult?: TQuery['customObjects'];
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<TQuery>>;
};

const client = createApolloClient();

export const useCustomObjectsFetcher: TUseCustomObjectsFetcher = (
  variables: TQuery_CustomObjectsArgs
) => {
  const { data, loading, error, refetch } = useMcQuery<
    TQuery,
    TQuery_CustomObjectsArgs
  >(GetCustomObjects, {
    variables: variables,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customObjectsPaginatedResult: data?.customObjects,
    error,
    loading,
    refetch,
  };
};

type TUseCustomObjectFetcher = (variables: TQuery_CustomObjectArgs) => {
  customObject?: TQuery['customObject'];
  error?: ApolloError;
  loading: boolean;
  refetch(): Promise<ApolloQueryResult<TQuery>>;
};

export const useCustomObjectFetcher: TUseCustomObjectFetcher = (
  variables: TQuery_CustomObjectArgs
) => {
  const { data, loading, error, refetch } = useMcQuery<
    TQuery,
    TQuery_CustomObjectArgs
  >(GetCustomObject, {
    variables: variables,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customObject: data?.customObject,
    error,
    loading,
    refetch,
  };
};

export const useCustomObjectUpdater = () => {
  const execute = async ({
    draft,
    onCompleted,
    onError,
  }: {
    draft: NonNullable<TCustomObjectDraft>;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    const controller = new CustomObjectController(client as GraphQLClient, {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    });
    try {
      await controller
        .createOrUpdateCustomObject(
          draft.container,
          draft.key,
          draft.value,
          draft.container
        )
        .then(() => {
          onCompleted && onCompleted();
        })
        .catch((error) => {
          onError && onError(error.message);
        });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    execute,
  };
};

export const useCustomObjectDeleter = () => {
  const [deleteCustomObject, { loading }] = useMcMutation<
    TMutation,
    TMutation_DeleteCustomObjectArgs
  >(DeleteCustomObject);

  const execute = async ({
    id,
    version,
    onCompleted,
    onError,
  }: {
    id: string;
    version: number;
    onCompleted?: () => void;
    onError?: (message?: string) => void;
  }) => {
    try {
      return await deleteCustomObject({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          id: id,
          version: version,
        },
        onCompleted() {
          onCompleted && onCompleted();
        },
        onError({ message }) {
          onError && onError(message);
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};
