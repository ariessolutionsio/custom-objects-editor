import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import PaymentMethodById from './payment-by-id.graphql';
import PaymentMethodByKey from './payment-by-key.graphql';
import PaymentMethodSearch from './payment-search.graphql';
import PaymentMethodAll from './payment-all.graphql';
import { Payment } from './types';

const localizePath = (payment: Payment) => {
  return `${payment.id} - Amount: ${
    (payment.amountPlanned?.centAmount ?? 0) / 100
  } ${payment.amountPlanned?.currencyCode}${
    payment.customer?.email ? ` - Customer: ${payment.customer.email}` : ''
  }`;
};

const PaymentSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Payment>
> = (props) => {
  const optionMapper = (data: Result<Payment>) =>
    data.payments.results.map((payment: Payment): TEntity => {
      return {
        id: payment.id,
        name: localizePath(payment),
        key: payment.key,
      };
    });

  const variableBuilder = (text: string) => {
    if (isNaN(parseInt(text))) {
      return {
        where: `key="${text}" or amountPlanned(currencyCode= "${text}")`,
      };
    }
    return {
      where: `amountPlanned(centAmount = ${text})`,
    };
  };

  return (
    <AsyncSearchInput<Payment, Result<Payment>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={PaymentMethodSearch}
      byKeyQuery={PaymentMethodByKey}
      byIdQuery={PaymentMethodById}
      allQuery={PaymentMethodAll}
      {...props}
    />
  );
};

export default PaymentSearchInput;
