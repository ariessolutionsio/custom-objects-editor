// mc-app/src/components/reference-input/search-components/cart-discount.tsx

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import CartDiscountById from './cart-discount-by-id.graphql';
import CartDiscountByKey from './cart-discount-by-key.graphql';
import CartDiscountSearch from './cart-discount-search.graphql';
import CartDiscountAll from './cart-discount-all.graphql';
import { CartDiscount } from './types';

const localizePath = (cartdiscount: CartDiscount) => {
  return `${cartdiscount.name} - isActive: ${cartdiscount.isActive} - key: ${cartdiscount.key}`;
};

const CartDiscountSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<CartDiscount>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<CartDiscount>) =>
    data.cartDiscounts.results.map((cartDiscount: CartDiscount): TEntity => {
      return {
        id: cartDiscount.id,
        name: cartDiscount.name,
        key: cartDiscount.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `name(${dataLocale} = "${text}") or description(${dataLocale} = "${text}") or key = "${text}"`,
  });

  return (
    <AsyncSearchInput<CartDiscount, Result<CartDiscount>>
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      localizePath={localizePath}
      searchQuery={CartDiscountSearch}
      byKeyQuery={CartDiscountByKey}
      byIdQuery={CartDiscountById}
      allQuery={CartDiscountAll}
      {...props}
    />
  );
};

export default CartDiscountSearchInput;
