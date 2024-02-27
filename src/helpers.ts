import {
  transformLocalizedStringToLocalizedField,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { ApolloError, type ServerError } from '@apollo/client';
import type { TChannel } from './types/generated/ctp';

export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const isServerError = (
  error: ApolloError['networkError']
): error is ServerError => {
  return Boolean((error as ServerError)?.result);
};

export const extractErrorFromGraphQlResponse = (graphQlResponse: unknown) => {
  if (graphQlResponse instanceof ApolloError) {
    if (
      isServerError(graphQlResponse.networkError) &&
      graphQlResponse.networkError?.result?.errors.length > 0
    ) {
      return graphQlResponse?.networkError?.result.errors;
    }

    if (graphQlResponse.graphQLErrors?.length > 0) {
      return graphQlResponse.graphQLErrors;
    }
  }

  return graphQlResponse;
};

const getNameFromPayload = (payload: any) => ({
  name: transformLocalizedStringToLocalizedField(payload.name),
});

const isChangeNameActionPayload = (
  actionPayload: Record<string, unknown>
): actionPayload is any => {
  return (actionPayload as any)?.name !== undefined;
};

const convertAction = (action: any): any => {
  const { action: actionName, ...actionPayload } = action;
  return {
    [actionName]:
      actionName === 'changeName' && isChangeNameActionPayload(actionPayload)
        ? getNameFromPayload(actionPayload)
        : actionPayload,
  };
};

export const createGraphQlUpdateActions = (actions: any[]) =>
  actions.reduce<any[]>(
    (previousActions, syncAction) => [
      ...previousActions,
      convertAction(syncAction),
    ],
    []
  );

export const convertToActionData = (draft: Partial<TChannel>) => ({
  ...draft,
  name: transformLocalizedFieldToLocalizedString(draft.nameAllLocales || []),
});
