import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ProductTypeById from './product-type-by-id.graphql';
import ProductTypeByKey from './product-type-by-key.graphql';
import ProductTypeSearch from './product-type-search.graphql';
import ProductTypeAll from './product-type-all.graphql';
import { ProductType } from './types';

const localizePath = (product: ProductType) => {
  return `${product.name} (${product.key})`;
};

const ProductTypeSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<ProductType>
> = (props) => {
  const optionMapper = (data: Result<ProductType>) =>
    data.productTypes.results.map((productType: ProductType): TEntity => {
      return {
        id: productType.id,
        name: productType.name,
        key: productType.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `name = "${text}"`,
  });

  return (
    <AsyncSearchInput<ProductType, Result<ProductType>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={ProductTypeSearch}
      byKeyQuery={ProductTypeByKey}
      byIdQuery={ProductTypeById}
      allQuery={ProductTypeAll}
      {...props}
    />
  );
};

export default ProductTypeSearchInput;
