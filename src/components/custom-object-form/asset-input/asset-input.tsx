// src/components/attribute-input/asset-input.js

import Spacings from '@commercetools-uikit/spacings';
import TextInput from '@commercetools-uikit/text-input';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Text from '@commercetools-uikit/text';
import { FC } from 'react';
import SourceArrayInput from './source-array-input';
import { Asset, LocalizedString, Source } from './types';

type Props = {
  name: string;
  value?: any;
  touched?: any;
  errors?: any;
  onChange: (...args: any[]) => void;
  onBlur: (...args: any[]) => void;
};

const AssetInput: FC<Props> = ({
  name,
  value = {},
  onChange,
  touched,
  errors,
}) => {
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const triggerChange = (updatedValue: Partial<Asset>) => {
    onChange({ target: { name, value: updatedValue } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value: fieldValue } = e.target;
    triggerChange({ ...value, [fieldName]: fieldValue });
  };

  const handleLocalizedChange = (
    localizedValue: LocalizedString,
    fieldName: string
  ) => {
    triggerChange({ ...value, [fieldName]: localizedValue });
  };

  const handleSourcesChange = (sources: Source[]) => {
    triggerChange({ ...value, sources });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTags = e.target.value
      ? e.target.value.split(',').map((tag) => tag.trim())
      : [];
    triggerChange({ ...value, tags: newTags });
  };

  return (
    <Spacings.Stack scale="l">
      <TextInput
        name="key"
        placeholder="Key (publicId)"
        value={value?.key || ''}
        onChange={handleChange}
      />
      <Text.Body>
        <span className="text" style={{ margin: '0px' }}>
          Name:
        </span>
      </Text.Body>
      <LocalizedTextInput
        name="name"
        placeholder={'Asset Name' as unknown as Record<string, string>}
        value={value?.name || {}}
        selectedLanguage={dataLocale}
        onChange={(event) =>
          handleLocalizedChange(
            event.target.value as unknown as LocalizedString,
            'name'
          )
        }
        hasError={!!(LocalizedTextInput.isTouched(touched) && errors)}
      />
      <Text.Body>Description:</Text.Body>
      <LocalizedTextInput
        name="description"
        placeholder={'Asset Description' as unknown as Record<string, string>}
        value={value?.description || {}}
        selectedLanguage={dataLocale}
        onChange={(event) =>
          handleLocalizedChange(
            event.target.value as unknown as LocalizedString,
            'description'
          )
        }
        hasError={!!(LocalizedTextInput.isTouched(touched) && errors)}
      />
      <TextInput
        name="tags"
        placeholder="Tags (comma-separated)"
        value={value?.tags?.join(', ') || ''}
        onChange={handleTagsChange}
      />
      <TextInput
        name="folder"
        placeholder="Folder"
        value={value?.folder || ''}
        onChange={handleChange}
      />

      <Spacings.Stack scale="s">
        <Text.Headline>Sources</Text.Headline>
        <SourceArrayInput
          value={value?.sources || []}
          onChange={handleSourcesChange}
        />
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

export default AssetInput;
