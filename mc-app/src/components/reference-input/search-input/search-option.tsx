import { FC } from 'react';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { OptionProps } from 'react-select';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

export const AsyncSelectOption: FC<OptionProps<any>> = (props) => {
  return (
    <AsyncSelectInput.Option {...props}>
      <Spacings.Stack scale="xs">
        <Text.Detail>{props.data.name}</Text.Detail>
      </Spacings.Stack>
    </AsyncSelectInput.Option>
  );
};
