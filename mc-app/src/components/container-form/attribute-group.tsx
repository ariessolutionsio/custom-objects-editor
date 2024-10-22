import React, { FC } from 'react';
import includes from 'lodash/includes';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import Spacings from '@commercetools-uikit/spacings';
import { useFormik } from 'formik';
import { get } from 'lodash';
import { ATTRIBUTES, AttributeValue, REFERENCE_BY, TYPES } from '../../constants';
import Attribute from './attribute';
import EnumAttributes from './enum-attributes';
import LocalizedEnumAttributes from './localized-enum-attributes';
import ObjectAttributes from './object-attributes';
import ReferenceAttribute from './reference-attribute';

type TFormValues = {
  name?: string;
  type?: string;
  required?: boolean;
  set?: boolean;
  attributes?: Array<any>;
  reference?: {
    by?: string;
    type?: string;
  };
};

type Formik = ReturnType<typeof useFormik<TFormValues>>;

type Props = {
  name: string;
  value: AttributeValue;
  touched: any;
  errors: any;
  handleBlur: Formik['handleBlur'];
  handleChange: Formik['handleChange'];
  remove: () => void;
  removeDisabled?: boolean;
  isDisplayed?: boolean;
};

const AttributeGroup: FC<Props> = ({
  name,
  value,
  touched,
  errors,
  handleBlur,
  handleChange,
  remove,
  removeDisabled,
  isDisplayed,
}) => {
  const { projectLanguages } = useApplicationContext((context) => ({
    projectLanguages: context.project?.languages ?? [],
  }));

  function onChange(event: any) {
    const { name: eventName, value: eventValue } = event.target;
    if (includes(eventName, ATTRIBUTES.Type)) {
      if (eventValue === TYPES.Object) {
        handleChange({
          target: {
            name: `${name}.${ATTRIBUTES.Attributes}`,
            value: [
              {
                name: '',
                type: '',
                set: false,
                required: false,
              },
            ],
          },
        });
      } else if (eventValue === TYPES.Reference) {
        handleChange({
          target: {
            name: `${name}.${ATTRIBUTES.Reference}`,
            value: {
              by: REFERENCE_BY.Id,
              type: '',
            },
          },
        });
      } else if (eventValue === TYPES.Enum) {
        handleChange({
          target: {
            name: `${name}.${ATTRIBUTES.Enum}`,
            value: [{ value: '', label: '' }],
          },
        });
      } else if (eventValue === TYPES.LocalizedEnum) {
        handleChange({
          target: {
            name: `${name}.${ATTRIBUTES.LocalizedEnum}`,
            value: [
              {
                value: '',
                label:
                  LocalizedTextInput.createLocalizedString(projectLanguages),
              },
            ],
          },
        });
      }
    }

    handleChange(event);
  }

  return (
    <Spacings.Stack scale="m">
      <Attribute
        name={name}
        value={value}
        touched={touched}
        errors={errors}
        handleBlur={handleBlur}
        handleChange={onChange}
        remove={remove}
        removeDisabled={removeDisabled}
        isDisplayed={isDisplayed}
      />
      {value.type === TYPES.Object && (
        <ObjectAttributes
          object={value.name}
          isDisplayed={get(value, ATTRIBUTES.Display)}
          name={`${name}.${ATTRIBUTES.Attributes}`}
          value={get(value, ATTRIBUTES.Attributes)}
          touched={get(touched, ATTRIBUTES.Attributes, [])}
          errors={get(errors, ATTRIBUTES.Attributes, [])}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      )}
      {value.type === TYPES.Reference && (
        <ReferenceAttribute
          name={`${name}.${ATTRIBUTES.Reference}`}
          value={get(value, ATTRIBUTES.Reference)}
          touched={get(touched, ATTRIBUTES.Reference, {})}
          errors={get(errors, ATTRIBUTES.Reference, {})}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      )}
      {value.type === TYPES.Enum && (
        <EnumAttributes
          name={`${name}.${ATTRIBUTES.Enum}`}
          value={get(value, ATTRIBUTES.Enum)}
          touched={get(touched, ATTRIBUTES.Enum, [])}
          errors={get(errors, ATTRIBUTES.Enum, [])}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      )}
      {value.type === TYPES.LocalizedEnum && (
        <LocalizedEnumAttributes
          name={`${name}.${ATTRIBUTES.LocalizedEnum}`}
          value={get(value, ATTRIBUTES.LocalizedEnum)}
          touched={get(touched, ATTRIBUTES.LocalizedEnum, [])}
          errors={get(errors, ATTRIBUTES.LocalizedEnum, [])}
          handleBlur={handleBlur}
          handleChange={handleChange}
        />
      )}
    </Spacings.Stack>
  );
};
AttributeGroup.displayName = 'AttributeGroup';

export default AttributeGroup;
