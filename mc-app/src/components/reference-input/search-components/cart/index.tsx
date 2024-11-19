import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import CartById from './cart-by-id.graphql';
import CartByKey from './cart-by-key.graphql';
import CartSearch from './cart-search.graphql';
import CartAll from './cart-all.graphql';
import { Cart } from './types';

const localizePath = (cart: Cart) => {
  return `${cart.customerEmail ?? ''} ${
    (cart.totalPrice?.centAmount ?? 0) / 100
  } ${cart.totalPrice?.currencyCode || 'N/A'} ${
    cart.billingAddress?.streetName ?? ''
  } ${cart.billingAddress?.city ?? ''} ${cart.billingAddress?.state ?? ''} ${
    cart.billingAddress?.country ?? ''
  }`;
};

const CartSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Cart>
> = (props) => {
  const optionMapper = (data: Result<Cart>) =>
    data.carts.results.map((cart: Cart): TEntity => {
      return {
        id: cart.id,
        name: localizePath(cart),
        key: cart.key,
      };
    });
  const variableBuilder = (text: string) => ({
    where: `customerEmail = "${text}" or billingAddress(country= "${text}") or billingAddress(city= "${text}") or billingAddress(state= "${text}") or billingAddress(streetName= "${text}")`,
  });

  return (
    <AsyncSearchInput<Cart, Result<Cart>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      allQuery={CartAll}
      searchQuery={CartSearch}
      byKeyQuery={CartByKey}
      byIdQuery={CartById}
      {...props}
    />
  );
};
CartSearchInput.displayName = 'CartSearchInput';

export default CartSearchInput;
