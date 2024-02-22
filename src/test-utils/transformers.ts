import { Transformer } from '@commercetools-test-data/core';
import type { TCustomObject, TCustomObjectGraphql } from './types';

const transformers = {
  default: Transformer<TCustomObject, TCustomObject>('default', {
    buildFields: ['createdBy', 'lastModifiedBy'],
  }),
  rest: Transformer<TCustomObject, TCustomObject>('rest', {
    buildFields: ['createdBy', 'lastModifiedBy'],
  }),
  graphql: Transformer<TCustomObject, TCustomObjectGraphql>('graphql', {
    buildFields: ['createdBy', 'lastModifiedBy'],
    addFields: ({ fields }) => {
      // const nameAllLocales = LocalizedString.toLocalizedField(fields.name);
      // const descriptionAllLocales = LocalizedString.toLocalizedField(
      //   fields.description
      // );

      return {
        __typename: 'CustomObject',
        // nameAllLocales,
        // descriptionAllLocales,
      };
    },
  }),
};

export default transformers;
