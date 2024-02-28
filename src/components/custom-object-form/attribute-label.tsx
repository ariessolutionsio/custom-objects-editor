import { FC } from 'react';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import { useIntl } from 'react-intl';
import FieldLabel from '@commercetools-uikit/field-label';
import { TYPES } from '../../constants';
import messages from './messages';

type Props = {
  type: string;
  title: string;
  isRequired?: boolean;
  reference?: {
    by?: string;
    type?: string;
  };
};

const AttributeLabel: FC<Props> = ({ type, title, isRequired, reference }) => {
  const intl = useIntl();
  return (
    <>
      {type !== TYPES.Boolean && (
        <FieldLabel
          title={startCase(title)}
          hasRequiredIndicator={isRequired}
          hint={
            reference
              ? `${startCase(reference.type)} ${capitalize(
                reference.by
              )} ${intl.formatMessage(messages.referenceLabel)}`
              : ''
          }
        />
      )}
    </>
  );
};
AttributeLabel.displayName = 'AttributeLabel';
export default AttributeLabel;
