import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import TaxCategoryById from './tax-category-by-id.graphql';
import TaxCategoryByKey from './tax-category-by-key.graphql';
import TaxCategorySearch from './tax-category-search.graphql';
import TaxCategoryAll from './tax-category-all.graphql';
import { TaxCategory } from './types';

const localizePath = (taxCategory: TaxCategory) => {
  return `${taxCategory.name} (${taxCategory.key})`;
};

const TaxCategorySearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<TaxCategory>
> = (props) => {
  const optionMapper = (data: Result<TaxCategory>) =>
    data.taxCategories.results.map((taxCategory: TaxCategory): TEntity => {
      return {
        id: taxCategory.id,
        name: localizePath(taxCategory),
        key: taxCategory.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `name = "${text}" or description = "${text}"`,
  });

  return (
    <AsyncSearchInput<TaxCategory, Result<TaxCategory>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={TaxCategorySearch}
      byKeyQuery={TaxCategoryByKey}
      byIdQuery={TaxCategoryById}
      allQuery={TaxCategoryAll}
      {...props}
    />
  );
};

export default TaxCategorySearchInput;
