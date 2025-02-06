import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ProductById from './product-by-id.graphql';
import ProductByKey from './product-by-key.graphql';
import ProductSearch from './product-search.graphql';
import ProductAll from './product-all.graphql';
import { Product, ProductProjectionItem } from './types';

const localizePathProductprojection = (product: ProductProjectionItem) => {
  return `${product.name} (${product.masterVariant?.sku})`;
};
const localizePath = (product: Product) => {
  return `${product.masterData?.current?.name} (${product.masterData?.current?.masterVariant?.sku})`;
};

const ProductSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Product>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => context);
  const optionMapper = (data: Result<Product>) =>
    data.productProjectionSearch.results.map((product: Product): TEntity => {
      return {
        id: product.id,
        name: localizePathProductprojection(product),
        key: product.key,
      };
    });

  const variableBuilder = (text: string) => ({
    text,
    locale: dataLocale,
  });
  return (
    <AsyncSearchInput<Product, Result<Product>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={ProductSearch}
      byKeyQuery={ProductByKey}
      byIdQuery={ProductById}
      allQuery={ProductAll}
      {...props}
    />
  );
};
ProductSearchInput.displayName = 'CustomerSearchInput';

export default ProductSearchInput;
