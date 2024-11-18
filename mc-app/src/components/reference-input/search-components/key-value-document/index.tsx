// workspace/key-value-document.tsx

import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import KeyValueDocumentById from './key-value-document-by-id.graphql';
import KeyValueDocumentByKey from './key-value-document-by-key.graphql';
import KeyValueDocumentSearch from './key-value-document-search.graphql';
import { KeyValueDocument } from './types';

const localizePath = (keyValueDocument: KeyValueDocument) => {
  return `Container: ${keyValueDocument.container}, key: ${keyValueDocument.key}`;
};
const KeyValueDocumentSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> &
    GenericSearchInputProps<KeyValueDocument>
> = (props) => {
  const optionMapper = (data: Result<KeyValueDocument>) =>
    data.customObjects.results.map(
      (keyValueDocument: KeyValueDocument): TEntity => {
        return {
          id: keyValueDocument.id,
          name: localizePath(keyValueDocument),
          key: keyValueDocument.key,
        };
      }
    );

  const variableBuilder = (text: string) => {
    if (text.split(' ').length > 1) {
      return {
        container: text.split(' ')[0],
        where: `key = "${text.split(' ')[1]}"`,
      };
    }
    return {
      container: text,
      //   where: '',
    };
  };

  return (
    <AsyncSearchInput<KeyValueDocument, Result<KeyValueDocument>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={KeyValueDocumentSearch}
      byKeyQuery={KeyValueDocumentByKey}
      byIdQuery={KeyValueDocumentById}
      {...props}
    />
  );
};

export default KeyValueDocumentSearchInput;
