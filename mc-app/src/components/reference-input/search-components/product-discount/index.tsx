// mc-app/src/components/reference-input/search-components/cart-discount.tsx

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ProductDiscountById from './product-discount-by-id.graphql';
import ProductDiscountByKey from './product-discount-by-key.graphql';
import ProductDiscountSearch from './product-discount-search.graphql';
import ProductDiscountAll from './product-discount-all.graphql';
import { ProductDiscount } from './types';

const localizePath = (productdiscount: ProductDiscount) => {
  return `${productdiscount.name} - isActive: ${productdiscount.isActive} - key: ${productdiscount.key}`;
};

const ProductDiscountSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> &
    GenericSearchInputProps<ProductDiscount>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<ProductDiscount>) =>
    data.productDiscounts.results.map(
      (productDiscount: ProductDiscount): TEntity => {
        return {
          id: productDiscount.id,
          name: productDiscount.name,
          key: productDiscount.key,
        };
      }
    );

  const variableBuilder = (text: string) => ({
    where: `name(${dataLocale} = "${text}") or description(${dataLocale} = "${text}") or key = "${text}"`,
  });

  return (
    <AsyncSearchInput<ProductDiscount, Result<ProductDiscount>>
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      localizePath={localizePath}
      searchQuery={ProductDiscountSearch}
      byKeyQuery={ProductDiscountByKey}
      byIdQuery={ProductDiscountById}
      allQuery={ProductDiscountAll}
      {...props}
    />
  );
};

export default ProductDiscountSearchInput;
