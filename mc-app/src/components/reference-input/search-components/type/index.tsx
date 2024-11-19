import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import TypeById from './type-by-id.graphql';
import TypeByKey from './type-by-key.graphql';
import TypeSearch from './type-search.graphql';
import TypeAll from './type-all.graphql';
import { TType } from './types';

const localizePath = (type: TType) => {
  return `${type.name ?? ''} - key: ${
    type.key
  }, Resources: ${type.resourceTypeIds?.join(', ')}`;
};

const TypeSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<TType>
> = (props) => {
  const optionMapper = (data: Result<TType>) =>
    data.typeDefinitions.results.map((type: TType): TEntity => {
      return {
        id: type.id,
        name: localizePath(type),
        key: type.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `key = "${text}"`,
  });

  return (
    <AsyncSearchInput<TType, Result<TType>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={TypeSearch}
      byKeyQuery={TypeByKey}
      byIdQuery={TypeById}
      allQuery={TypeAll}
      {...props}
    />
  );
};

export default TypeSearchInput;
