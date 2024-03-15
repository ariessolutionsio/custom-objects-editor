import {
  transformLocalizedStringToLocalizedField,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import { ApolloError, type ServerError } from '@apollo/client';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { IntlShape, MessageDescriptor } from 'react-intl';
import { addMethod, array, object, string, number, date, boolean } from 'yup';
import type { TChannel } from './types/generated/ctp';
import {
  AttributeValue,
  Reference,
  TYPES,
  TYPES_ENUM,
} from './constants';
import { getAttributeValues, getAttributeValidation } from './form-utils';

export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const isServerError = (
  error: ApolloError['networkError']
): error is ServerError => {
  return Boolean((error as ServerError)?.result);
};

export const extractErrorFromGraphQlResponse = (graphQlResponse: any) => {
  if (graphQlResponse && graphQlResponse.networkError) {
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


export const getValueByType = (
  type: TYPES_ENUM,
  attributes: Array<AttributeValue> | undefined,
  reference: Reference | undefined,
  currencies: Array<string>,
  languages: Array<string>
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Number:
    case TYPES.Date:
    case TYPES.Time:
    case TYPES.DateTime:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
      return '';

    case TYPES.LocalizedString:
      return LocalizedTextInput.createLocalizedString(languages);

    case TYPES.Boolean:
      return false;

    case TYPES.Money:
      return {
        amount: '',
        currencyCode: currencies[0],
      };

    case TYPES.Reference:
      return (
        reference && {
          typeId: reference.type,
          [reference.by]: '',
        }
      );

    case TYPES.Object:
      return (
        attributes && getAttributeValues(attributes, currencies, languages)
      );

    default:
      return null;
  }
};

export const getInitialValueByType = (
  type: any,
  isSet: any,
  attributes: any,
  reference: any,
  currencies: Array<string>,
  languages: Array<string>
) =>
  isSet
    ? [getValueByType(type, attributes, reference, currencies, languages)]
    : getValueByType(type, attributes, reference, currencies, languages);

export const getValidation = (
  method: any,
  required: any,
  messages: any,
  intl: IntlShape
) => {
  let validation: any;
  switch (method) {
    case 'string':
      validation = string();
      break;
    case 'number':
      validation = number();
      break;
    case 'date':
      validation = date();
      break;
    case 'boolean':
      validation = boolean();
      break;
    default:
      validation = string();
      break;
  }

  //"<FormattedMessage {...messages.required} />
  return required
    ? validation.required(intl.formatMessage(messages.required))
    : validation.nullable();
};

export const getLocalizedStringValidation = (
  languages: Array<string>,
  required: boolean,
  messages: { [key: string]: MessageDescriptor }
) => {
  addMethod(object, 'atLeastOneOf', function (list) {
    return this.test({
      name: 'atLeastOneOf',
      message: messages.required as any, //<FormattedMessage {...messages.required} />,
      exclusive: true,
      test: (value) =>
        value == null || list.some((f: any) => !isNil(get(value, f))),
    });
  });

  const localizedStringSchema = reduce(
    languages,
    (name, lang) => ({ ...name, [lang]: string() }),
    {}
  );
  const validation: any = object(localizedStringSchema);

  return required ? validation.atLeastOneOf(languages) : validation;
};

export const getValidationByType = (
  { type, required, attributes, reference }: any,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
) => {
  switch (type) {
    case TYPES.String:
    case TYPES.Enum:
    case TYPES.LocalizedEnum:
    case TYPES.Time:
      return getValidation('string', required, messages, intl);

    case TYPES.LocalizedString:
      return getLocalizedStringValidation(languages, required, messages);

    case TYPES.Number:
      return getValidation('number', required, messages, intl);

    case TYPES.Boolean:
      return getValidation('boolean', required, messages, intl);

    case TYPES.Money:
      return object({
        amount: getValidation('string', required, messages, intl),
        currencyCode: string(),
      });

    case TYPES.Date:
    case TYPES.DateTime:
      return getValidation('date', required, messages, intl);

    case TYPES.Reference:
      return object({
        typeId: string(),
        [reference.by]: getValidation('string', required, messages, intl),
      });

    case TYPES.Object:
      return object(
        getAttributeValidation(attributes, languages, messages, intl)
      );

    default:
      return null;
  }
};

export const getValidationSpecification = (
  attribute: AttributeValue,
  languages: Array<string>,
  messages: { [key: string]: MessageDescriptor },
  intl: IntlShape
) => {
  const validation = getValidationByType(attribute, languages, messages, intl);
  return attribute.set ? array(validation) : validation;
};