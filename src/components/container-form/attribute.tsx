import React, { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import SelectField from '@commercetools-uikit/select-field';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, InformationIcon } from '@commercetools-uikit/icons';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import Tooltip from '@commercetools-uikit/tooltip';
import { useFormik } from 'formik';
import { ATTRIBUTES, AttributeValue, TYPES } from '../../constants';
import messages from './messages';
import styles from './attribute.mod.css';

type Formik = ReturnType<typeof useFormik<AttributeValue>>;

const typeOptions = [
  {
    label: <FormattedMessage {...messages.stringLabel} />,
    value: TYPES.String,
  },
  {
    label: <FormattedMessage {...messages.localizedStringLabel} />,
    value: TYPES.LocalizedString,
  },
  {
    label: <FormattedMessage {...messages.numberLabel} />,
    value: TYPES.Number,
  },
  {
    label: <FormattedMessage {...messages.booleanLabel} />,
    value: TYPES.Boolean,
  },
  {
    label: <FormattedMessage {...messages.moneyLabel} />,
    value: TYPES.Money,
  },
  {
    label: <FormattedMessage {...messages.dateLabel} />,
    value: TYPES.Date,
  },
  {
    label: <FormattedMessage {...messages.timeLabel} />,
    value: TYPES.Time,
  },
  {
    label: <FormattedMessage {...messages.dateTimeLabel} />,
    value: TYPES.DateTime,
  },
  {
    label: <FormattedMessage {...messages.enumLabel} />,
    value: TYPES.Enum,
  },
  {
    label: <FormattedMessage {...messages.localizedEnumLabel} />,
    value: TYPES.LocalizedEnum,
  },
  {
    label: <FormattedMessage {...messages.objectLabel} />,
    value: TYPES.Object,
  },
  {
    label: <FormattedMessage {...messages.referenceLabel} />,
    value: TYPES.Reference,
  },
];

type Props = {
  name: string;
  value: AttributeValue;
  touched: Formik['touched'];
  errors?: any;
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
  remove: () => void;
  removeDisabled?: boolean;
  isDisplayed?: boolean;
};

const Attribute: FC<Props> = ({
  name,
  value,
  touched,
  errors,
  handleChange,
  handleBlur,
  remove,
  removeDisabled,
  isDisplayed,
}) => {
  const intl = useIntl();
  const isRequiredDisabled =
    value.type === TYPES.Object || value.type === TYPES.Boolean;

  // React.useEffect(() => {
  //   if (isRequiredDisabled) {
  //     handleChange({
  //       target: { name: `${name}.required`, value: false },
  //     });
  //   }
  // }, [value.type]);


  return (
    <Spacings.Inline alignItems="center" justifyContent="space-between">
      <div className={styles.attribute}>
        <TextField
          name={`${name}.${ATTRIBUTES.Name}`}
          title={<FormattedMessage {...messages.nameTitle} />}
          horizontalConstraint="scale"
          isRequired
          value={value.name}
          touched={touched.name}
          // errors={errors.name}
          onChange={handleChange}
          onBlur={handleBlur}
          // renderError={(key, error) => error}
        />
        <SelectField
          name={`${name}.${ATTRIBUTES.Type}`}
          title={<FormattedMessage {...messages.typeTitle} />}
          horizontalConstraint="scale"
          isRequired
          value={value.type}
          touched={touched.type}
          errors={errors.type}
          options={typeOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          // renderError={(key, error) => error}
        />
        <Spacings.Stack scale="s">
          <Spacings.Inline alignItems="center">
            <Text.Body isBold intlMessage={messages.attributeSettingsTitle} />
            <Tooltip title={intl.formatMessage(messages.attributeSettingsHint)}>
              <IconButton
                label={intl.formatMessage(messages.attributeSettingsTitle)}
                icon={<InformationIcon />}
                size="small"
              />
            </Tooltip>
          </Spacings.Inline>
          <Spacings.Inline alignItems="center">
            <CheckboxInput
              data-testid="attribute-required"
              name={`${name}.${ATTRIBUTES.Required}`}
              value={JSON.stringify(value.required)}
              isChecked={value.required}
              isDisabled={isRequiredDisabled}
              onChange={handleChange}
            >
              <FormattedMessage {...messages.requiredTitle} />
            </CheckboxInput>
            <CheckboxInput
              name={`${name}.${ATTRIBUTES.Set}`}
              value={JSON.stringify(value.set)}
              isChecked={value.set}
              onChange={handleChange}
            >
              <FormattedMessage {...messages.setTitle} />
            </CheckboxInput>
            <CheckboxInput
              name={`${name}.${ATTRIBUTES.Display}`}
              value={JSON.stringify(value.display)}
              isDisabled={isDisplayed}
              isChecked={value.display}
              onChange={handleChange}
            >
              <FormattedMessage {...messages.displayTitle} />
            </CheckboxInput>
          </Spacings.Inline>
        </Spacings.Stack>
      </div>
      <SecondaryIconButton
        icon={<BinLinearIcon />}
        label={intl.formatMessage(messages.removeAttributeButton)}
        onClick={remove}
        isDisabled={removeDisabled}
      />
    </Spacings.Inline>
  );
};
Attribute.displayName = 'Attribute';

export default Attribute;
