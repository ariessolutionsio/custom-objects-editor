import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import OrderById from './order-by-id.graphql';
import OrderByKey from './order-by-key.graphql';
import OrderSearch from './order-search.graphql';
import OrderAll from './order-all.graphql';
import { Order } from './types';

const localizePath = (order: Order) => {
  return `OrderNumber: ${order.orderNumber} - ${order.customerEmail ?? ''} ${
    (order.totalPrice?.centAmount ?? 0) / 100
  } ${order.totalPrice?.currencyCode || 'N/A'} ${
    order.billingAddress?.streetName ?? ''
  } ${order.billingAddress?.city ?? ''} ${order.billingAddress?.state ?? ''} ${
    order.billingAddress?.country ?? ''
  }`;
};

const OrderSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Order>
> = (props) => {
  const optionMapper = (data: Result<Order>) =>
    data.orders.results.map((order: Order): TEntity => {
      return {
        id: order.id,
        name: localizePath(order),
        key: order.orderNumber,
      };
    });
  const variableBuilder = (text: string) => ({
    where: `orderNumber = "${text}" or customerEmail = "${text}" or billingAddress(country= "${text}") or billingAddress(city= "${text}") or billingAddress(state= "${text}") or billingAddress(streetName= "${text}")`,
  });

  return (
    <AsyncSearchInput<Order, Result<Order>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={OrderSearch}
      byKeyQuery={OrderByKey}
      byIdQuery={OrderById}
      allQuery={OrderAll}
      {...props}
    />
  );
};
OrderSearchInput.displayName = 'OrderSearchInput';

export default OrderSearchInput;
