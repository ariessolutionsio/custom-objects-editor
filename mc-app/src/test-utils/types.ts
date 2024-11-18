import type {
  CustomObject,
  CustomObjectDraft,
} from '@commercetools/platform-sdk';
import type { TBuilder } from '@commercetools-test-data/core';
import type {
  TClientLoggingGraphql,
  TLocalizedStringGraphql,
} from '@commercetools-test-data/commons';

export type TCustomObject = CustomObject;
export type TCustomObjectDraft = CustomObjectDraft;

export type TCustomObjectDraftGraphql = Omit<
  TCustomObjectDraft,
  'name' | 'description'
> & {
  __typename: 'ChannelDraft';
  name?: TLocalizedStringGraphql;
  description?: TLocalizedStringGraphql;
};

export type TCustomObjectGraphql = Omit<
  TCustomObject,
  // In GraphQL, we prefer to use `nameAllLocales` instead of `name`.
  | 'name'
  // In GraphQL, we prefer to use `descriptionAllLocales` instead of `description`.
  | 'description'
  // In GraphQL, the object shape is different.
  | 'createdBy'
  // In GraphQL, the object shape is different.
  | 'lastModifiedBy'
> & {
  __typename: 'CustomObject';
  createdBy: TClientLoggingGraphql;
  lastModifiedBy: TClientLoggingGraphql;
  nameAllLocales?: TLocalizedStringGraphql | null;
  descriptionAllLocales?: TLocalizedStringGraphql | null;
};

export type TCustomObjectBuilder = TBuilder<CustomObject>;
export type TCustomObjectDraftBuilder = TBuilder<CustomObjectDraft>;
export type TCreateCustomObjectBuilder = () => TCustomObjectBuilder;
export type TCreateCustomObjectDraftBuilder = () => TCustomObjectDraftBuilder;
