import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import StateById from './state-by-id.graphql';
import StateByKey from './state-by-key.graphql';
import StateSearch from './state-search.graphql';
import StateAll from './state-all.graphql';
import { State } from './types';

const localizePath = (state: State) => {
  return `${state.name} - key: ${state.key} - type: ${state.type}`;
};

const StateSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<State>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<State>) =>
    data.states.results.map((state: State): TEntity => {
      return {
        id: state.id,
        name: localizePath(state),
        key: state.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `name(${dataLocale} = "${text}") or key= "${text}"`,
  });

  return (
    <AsyncSearchInput<State, Result<State>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={StateSearch}
      byKeyQuery={StateByKey}
      byIdQuery={StateById}
      allQuery={StateAll}
      {...props}
    />
  );
};

export default StateSearchInput;
