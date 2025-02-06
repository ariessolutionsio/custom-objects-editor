// workspace/discount-code.tsx

import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { FC } from 'react';
import AsyncSearchInput from '../../search-input/async-search-input';
import { GenericSearchInputProps, Result } from '../../search-input/types';
import { TEntity } from '../../types';
import DiscountCodeById from './discount-code-by-id.graphql';
import DiscountCodeByKey from './discount-code-by-key.graphql';
import DiscountCodeSearch from './discount-code-search.graphql';
import DiscountCodeAll from './discount-code-all.graphql';
import { DiscountCode } from './types';

const localizePath = (discountCode: DiscountCode) => {
  return `${discountCode.name} (${discountCode.code})`;
};

const DiscountCodeSearchInput: FC<
  React.HTMLAttributes<HTMLDivElement> & GenericSearchInputProps<DiscountCode>
> = (props) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const optionMapper = (data: Result<DiscountCode>) =>
    data.discountCodes.results.map((discountCode: DiscountCode): TEntity => {
      return {
        id: discountCode.id,
        name: localizePath(discountCode),
        key: discountCode.key,
      };
    });

  const variableBuilder = (text: string) => ({
    where: `name(${dataLocale} = "${text}") or code = "${text}" or key = "${text}"`,
  });

  return (
    <AsyncSearchInput<DiscountCode, Result<DiscountCode>>
      optionMapper={optionMapper}
      variableBuilder={variableBuilder}
      localizePath={localizePath}
      searchQuery={DiscountCodeSearch}
      byKeyQuery={DiscountCodeByKey}
      byIdQuery={DiscountCodeById}
      allQuery={DiscountCodeAll}
      {...props}
    />
  );
};

export default DiscountCodeSearchInput;
