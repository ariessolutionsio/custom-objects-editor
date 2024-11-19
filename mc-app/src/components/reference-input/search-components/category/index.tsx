import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import CategoryById from './category-by-id.graphql';
import CategoryByKey from './category-by-key.graphql';
import CategorySearch from './category-search.graphql';
import CategoryAll from './category-all.graphql';
import { Category } from './types';

const localizePath = (category: Category, showProductCount = false) => {
  let path = category.ancestors
    ?.map((ancestor) => ancestor.name)
    .concat([category.name])
    .join(' > ');
  if (showProductCount) {
    path = `${path} (${category.stagedProductCount})`;
  }
  return path;
};

const CategorySearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Category>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<Category>) =>
    data.categories.results.map((category: Category): TEntity => {
      return {
        id: category.id,
        name: localizePath(category, false),
        key: category.key,
      };
    });
  const variableBuilder = (text: string) => ({
    fullText: { locale: dataLocale, text },
  });

  return (
    <AsyncSearchInput<Category, Result<Category>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={CategorySearch}
      byKeyQuery={CategoryByKey}
      byIdQuery={CategoryById}
      allQuery={CategoryAll}
      {...props}
    />
  );
};
CategorySearchInput.displayName = 'CategorySearchInput';

export default CategorySearchInput;
