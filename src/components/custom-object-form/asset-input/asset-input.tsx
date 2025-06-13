import Spacings from '@commercetools-uikit/spacings';
import TextInput from '@commercetools-uikit/text-input';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import Text from '@commercetools-uikit/text';
import { FC, useState } from 'react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import useCloudinary from '../../../hooks/use-cloudinary';
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
  const { dataLocale, environment } = useApplicationContext<{
    cloudinaryEnabled?: string | boolean;
    cloudinaryCloudName?: string;
    cloudinaryUploadPreset?: string;
  }>();

  const [isWidgetOpening, setIsWidgetOpening] = useState(false);
  const isCloudinaryEnabled =
    environment.cloudinaryEnabled === true &&
    !!environment.cloudinaryCloudName &&
    !!environment.cloudinaryUploadPreset;

  const cloudinaryLoaded = useCloudinary();

  const triggerChange = (updatedValue: Partial<Asset>) => {
    onChange({ target: { name, value: updatedValue } });
  };

  const handleOpenMediaLibrary = () => {
    if (cloudinaryLoaded && (window as any).cloudinary) {
      setIsWidgetOpening(true);
      (window as any).cloudinary.openUploadWidget(
        {
          cloudName: environment.cloudinaryCloudName || '',
          uploadPreset: environment.cloudinaryUploadPreset || '',
          sources: [
            'local',
            'url',
            'camera',
            'image_search',
            'google_drive',
            'facebook',
            'dropbox',
            'instagram',
            'shutterstock',
            'getty',
            'istock',
            'unsplash',
          ],
          multiple: false,
        },
        (error: any, result: any) => {
          if (
            result &&
            (result.event === 'success' ||
              result.event === 'close' ||
              result.event === 'abort')
          ) {
            setIsWidgetOpening(false);
          }

          if (!error && result && result.event === 'success') {
            const assetData = result.info;
            triggerChange({
              key: assetData.public_id,
              name: { [dataLocale || '']: assetData.original_filename || '' },
              description: { [dataLocale || '']: '' },
              tags: assetData.tags,
              folder: assetData.asset_folder,
              sources: [
                {
                  uri: assetData.secure_url,
                  key: assetData.public_id,
                  contentType: assetData.format,
                  width: assetData.width,
                  height: assetData.height,
                },
              ],
            });
          }
        }
      );
    }
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
    <Spacings.Stack scale="l" alignItems="flex-start">
      {isCloudinaryEnabled && (
        <PrimaryButton
          label={
            isWidgetOpening ? 'Loading...' : 'Open Cloudinary Media Library'
          }
          onClick={handleOpenMediaLibrary}
          isDisabled={!cloudinaryLoaded || isWidgetOpening}
          iconLeft={isWidgetOpening ? <LoadingSpinner /> : undefined}
        />
      )}
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
        selectedLanguage={dataLocale || ''}
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
        selectedLanguage={dataLocale || ''}
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
