import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ShoppingListById from './shopping-list-by-id.graphql';
import ShoppingListByKey from './shopping-list-by-key.graphql';
import ShoppingListSearch from './shopping-list-search.graphql';
import ShoppingListAll from './shopping-list-all.graphql';
import { ShoppingList } from './types';

const localizePath = (shoppingList: ShoppingList) => {
  return `${shoppingList.name ?? ''} - key: ${shoppingList.key}, customer: ${
    shoppingList.customer?.email ?? ''
  } - id: ${shoppingList.id}`;
};

const ShoppingListSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<ShoppingList>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<ShoppingList>) =>
    data.shoppingLists.results.map((shoppingList: ShoppingList): TEntity => {
      return {
        id: shoppingList.id,
        name: localizePath(shoppingList),
        key: shoppingList.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `name(${dataLocale} = "${text}") or key = "${text}"`,
  });

  return (
    <AsyncSearchInput<ShoppingList, Result<ShoppingList>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={ShoppingListSearch}
      byKeyQuery={ShoppingListByKey}
      byIdQuery={ShoppingListById}
      allQuery={ShoppingListAll}
      {...props}
    />
  );
};

export default ShoppingListSearchInput;
