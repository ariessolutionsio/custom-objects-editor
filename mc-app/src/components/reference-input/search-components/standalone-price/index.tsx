import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import StandalonePriceById from './standalone-price-by-id.graphql';
import StandalonePriceByKey from './standalone-price-by-key.graphql';
import StandalonePriceSearch from './standalone-price-search.graphql';
import StandalonePricAll from './standalone-price-all.graphql';
import { StandalonePrice } from './types';

const localizePath = (standalonePrice: StandalonePrice) => {
  return `SKU: ${standalonePrice.sku} - key: ${standalonePrice.key} - Price: ${
    (standalonePrice.value.centAmount ?? 0) / 100
  } ${standalonePrice.value.currencyCode}${
    standalonePrice.channel ? ` - channel: ${standalonePrice.channel.key}` : ''
  }${
    standalonePrice.customerGroup
      ? ` - customerGroup: ${standalonePrice.customerGroup.key}`
      : ''
  }`;
};

const StandalonePriceSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> &
    GenericSearchInputProps<StandalonePrice>
> = (props) => {
  const optionMapper = (data: Result<StandalonePrice>) =>
    data.standalonePrices.results.map(
      (standalonePrice: StandalonePrice): TEntity => {
        return {
          id: standalonePrice.id,
          name: localizePath(standalonePrice),
          key: standalonePrice.key,
        };
      }
    );

  const variableBuilder = (text: string) => {
    if (isNaN(parseInt(text))) {
      return {
        where: `key = "${text}" or sku = "${text}" or value(currencyCode="${text}")`,
      };
    }
    return {
      where: `value(centAmount = ${text})`,
    };
  };

  return (
    <AsyncSearchInput<StandalonePrice, Result<StandalonePrice>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={StandalonePriceSearch}
      byKeyQuery={StandalonePriceByKey}
      byIdQuery={StandalonePriceById}
      allQuery={StandalonePricAll}
      {...props}
    />
  );
};

export default StandalonePriceSearchInput;
