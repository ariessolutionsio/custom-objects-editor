import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ShippingMethodById from './shipping-method-by-id.graphql';
import ShippingMethodByKey from './shipping-method-by-key.graphql';
import ShippingMethodSearch from './shipping-method-search.graphql';
import ShippingMethodAll from './shipping-method-all.graphql';
import { ShippingMethod } from './types';

const localizePath = (shippingMethod: ShippingMethod) => {
  return `${shippingMethod.name ?? ''} - key: ${
    shippingMethod.key
  }, Zones: ${shippingMethod.zoneRates
    ?.map((zoneRate) => zoneRate.zone.name)
    .join(', ')}`;
};

const ShippingMethodSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<ShippingMethod>
> = (props) => {
  const optionMapper = (data: Result<ShippingMethod>) =>
    data.shippingMethods.results.map(
      (shippingMethod: ShippingMethod): TEntity => {
        return {
          id: shippingMethod.id,
          name: localizePath(shippingMethod),
          key: shippingMethod.key,
        };
      }
    );

  const variableBuilder = (text: string) => ({
    where: `name = "${text}" or description = "${text}"`,
  });

  return (
    <AsyncSearchInput<ShippingMethod, Result<ShippingMethod>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={ShippingMethodSearch}
      byKeyQuery={ShippingMethodByKey}
      byIdQuery={ShippingMethodById}
      allQuery={ShippingMethodAll}
      {...props}
    />
  );
};

export default ShippingMethodSearchInput;
