// src/components/attribute-input/source-input.tsx

import React from 'react';
import Grid from '@commercetools-uikit/grid';
import TextInput from '@commercetools-uikit/text-input';
import NumberInput from '@commercetools-uikit/number-input';
import { CloseIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Card from '@commercetools-uikit/card';
import type { Source } from './types';

type Props = {
  value: Source;
  index: number;
  onChange: (index: number, value: Source) => void;
  onRemove: (index: number) => void;
};

const SourceInput: React.FC<Props> = ({ value, index, onChange, onRemove }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: fieldValue } = e.target;
    onChange(index, { ...value, [name]: fieldValue });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: fieldValue } = e.target;
    onChange(index, {
      ...value,
      [name]: fieldValue ? parseInt(fieldValue, 10) : null,
    });
  };

  return (
    <Card type='raised'>
      <Spacings.Inline justifyContent="space-between" alignItems="center">
        <Text.Subheadline as="h4">Sources {index + 1}</Text.Subheadline>
        <SecondaryButton
          iconLeft={<CloseIcon size="medium" />}
          label="Remove Source"
          size="small"
          data-testid={`remove-source-${index}`}
          onClick={() => onRemove(index)}
        />
      </Spacings.Inline>
      <Grid gridGap="16px" gridTemplateColumns="repeat(2, 1fr)">
        <TextInput
          name="key"
          placeholder="Source Key"
          value={value.key || ''}
          onChange={handleChange}
        />
        <TextInput
          name="uri"
          placeholder="Source URI"
          value={value.uri || ''}
          onChange={handleChange}
        />
        <TextInput
          name="contentType"
          placeholder="Content Type (e.g., image/jpeg)"
          value={value.contentType || ''}
          onChange={handleChange}
        />
        <NumberInput
          name="width"
          placeholder="Width"
          value={value.width || ''}
          onChange={handleNumberChange}
        />
        <NumberInput
          name="height"
          placeholder="Height"
          value={value.height || ''}
          onChange={handleNumberChange}
        />
      </Grid>
    </Card>
  );
};

export default SourceInput;
