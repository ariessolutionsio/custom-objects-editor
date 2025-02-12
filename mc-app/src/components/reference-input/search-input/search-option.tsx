import { FC } from 'react';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { OptionProps } from 'react-select';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

export const AsyncSelectOption: FC<OptionProps<any>> = (props) => {
  return (
    <AsyncSelectInput.Option
      {...props}
      getStyles={(_, optionProps) => {
        return {
          padding: '8px',
          cursor: (optionProps as OptionProps<any>)?.data?.disabled
            ? 'not-allowed'
            : 'pointer',
          '&:hover': {
            backgroundColor: (optionProps as OptionProps<any>)?.data?.disabled
              ? 'var(--color-neutral-60)'
              : 'var(--color-primary-90)',
          },
        };
      }}
    >
      <Spacings.Stack scale="xs">
        <Text.Detail>{props.data.name}</Text.Detail>
      </Spacings.Stack>
    </AsyncSelectInput.Option>
  );
};
