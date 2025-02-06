// mc-app/src/components/reference-input/search-components/channel.tsx

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import ChannelById from './channel-by-id.graphql';
import ChannelByKey from './channel-by-key.graphql';
import ChannelSearch from './channel-search.graphql';
import ChannelAll from './channel-all.graphql';
import { Channel } from './types';

const localizePath = (channel: Channel) => {
  return `${channel.name} - roles: ${channel.roles.join(', ')} - key: ${
    channel.key
  }`;
};
const ChannelSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<Channel>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<Channel>) =>
    data.channels.results.map((channel: Channel): TEntity => {
      return {
        id: channel.id,
        name: channel.name,
        key: channel.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `key = "${text}" or name(${dataLocale} = "${text}")`,
  });

  return (
    <AsyncSearchInput<Channel, Result<Channel>>
      localizePath={localizePath}
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      searchQuery={ChannelSearch}
      byKeyQuery={ChannelByKey}
      byIdQuery={ChannelById}
      allQuery={ChannelAll}
      {...props}
    />
  );
};

export default ChannelSearchInput;
