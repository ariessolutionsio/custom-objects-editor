import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import CustomerGroupById from './customer-group-by-id.graphql';
import CustomerGroupByKey from './customer-group-by-key.graphql';
import CustomerGroupSearch from './customer-group-search.graphql';
import CustomerGroupAll from './customer-group-all.graphql';
import { CustomerGroup } from './types';

const localizePath = (customerGroup: CustomerGroup) => {
  return `${customerGroup.name} (${customerGroup.key})`;
};

const CustomerGroupSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<CustomerGroup>
> = (props) => {
  const optionMapper = (data: Result<CustomerGroup>) =>
    data.customerGroups.results.map((customerGroup: CustomerGroup): TEntity => {
      return {
        id: customerGroup.id,
        name: customerGroup.name,
        key: customerGroup.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `name = "${text}" or key = "${text}"`,
  });

  return (
    <AsyncSearchInput<CustomerGroup, Result<CustomerGroup>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={CustomerGroupSearch}
      byKeyQuery={CustomerGroupByKey}
      byIdQuery={CustomerGroupById}
      allQuery={CustomerGroupAll}
      {...props}
    />
  );
};

export default CustomerGroupSearchInput;
