// src/components/attribute-input/source-array-input.tsx

import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Constraints from '@commercetools-uikit/constraints';
import SourceInput from './source-input';
import type { Source } from './types';

type Props = {
  value: Source[];
  onChange: (value: Source[]) => void;
};

const SourceArrayInput: React.FC<Props> = ({ value = [], onChange }) => {
  const handleItemChange = (index: number, itemValue: Source) => {
    const newSources = value.map((item, i) => (i === index ? itemValue : item));
    onChange(newSources);
  };

  const handleAddItem = () => {
    const newSources = [...value, { key: '', uri: '', contentType: '' }];
    onChange(newSources);
  };

  const handleRemoveItem = (index: number) => {
    const newSources = value.filter((_, i) => i !== index);
    onChange(newSources);
  };

  return (
    <Spacings.Stack scale="m">
      {value.map((source, index) => (
        <SourceInput
          key={index}
          index={index}
          value={source}
          onChange={handleItemChange}
          onRemove={handleRemoveItem}
        />
      ))}
      <Constraints.Horizontal max="scale">
        <SecondaryButton
          size="small"
          label="Add Source"
          onClick={handleAddItem}
        />
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};

export default SourceArrayInput;
