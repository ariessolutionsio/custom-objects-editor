// mc-app/src/components/reference-input/search-components/channel.tsx

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import StoreById from './store-by-id.graphql';
import StoreByKey from './store-by-key.graphql';
import StoreSearch from './store-search.graphql';
import StoreAll from './store-all.graphql';
import { Store } from './types';

const localizePath = (store: Store) => {
  return `${store.name} - key: ${store.key}`;
};
const StoreSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Store>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<Store>) =>
    data.stores.results.map((store: Store): TEntity => {
      return {
        id: store.id,
        name: localizePath(store),
        key: store.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `key = "${text}" or name(${dataLocale} = "${text}")`,
  });

  return (
    <AsyncSearchInput<Store, Result<Store>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={StoreSearch}
      byKeyQuery={StoreByKey}
      byIdQuery={StoreById}
      allQuery={StoreAll}
      {...props}
    />
  );
};

export default StoreSearchInput;
