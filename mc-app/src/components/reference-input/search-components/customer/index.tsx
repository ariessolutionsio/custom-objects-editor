import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import CustomerById from './customer-by-id.graphql';
import CustomerByKey from './customer-by-key.graphql';
import CustomerSearch from './customer-search.graphql';
import CustomerAll from './customer-all.graphql';
import { Customer } from './types';

const localizePath = (customer: Customer) => {
  return (
    customer.firstName + ' ' + customer.lastName + ' (' + customer.email + ')'
  );
};

const CustomerSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Customer>
> = (props) => {
  const optionMapper = (data: Result<Customer>) =>
    data.customers.results.map((customer: Customer): TEntity => {
      return {
        id: customer.id,
        name: localizePath(customer),
        key: customer.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `firstName = "${text}" or lastName = "${text}" or email= "${text}"`,
  });
  return (
    <AsyncSearchInput<Customer, Result<Customer>>
      optionMapper={optionMapper}
      localizePath={localizePath}
      variableBuilder={variableBuilder}
      searchQuery={CustomerSearch}
      byKeyQuery={CustomerByKey}
      byIdQuery={CustomerById}
      allQuery={CustomerAll}
      {...props}
    />
  );
};
CustomerSearchInput.displayName = 'CustomerSearchInput';

export default CustomerSearchInput;
