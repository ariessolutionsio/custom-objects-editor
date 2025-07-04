import { FC, useState } from 'react';
import get from 'lodash/get';
import { useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import Card from '@commercetools-uikit/card';
import Constraints from '@commercetools-uikit/constraints';
import {
  BinLinearIcon,
  EyeIcon,
  PlusBoldIcon,
  SearchIcon,
} from '@commercetools-uikit/icons';
import Spacings from '@commercetools-uikit/spacings';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TYPES } from '../../constants';
import { getValueByType } from '../../helpers';
import AttributeLabel from './attribute-label';
import AttributeInput from './attribute-input';
import messages from './messages';
import { SortableItem } from './sortable-item';
import { CustomObjectsModal } from './custom-objects-modal';
import styles from './attribute-field.module.css';

type Props = {
  type: any;
  title: string;
  isRequired?: boolean;
  isSet?: boolean;
  isNestedSet?: boolean;
  name: string;
  value?: any;
  touched?: any;
  errors?: any;
  onChange(...args: unknown[]): unknown;
  onBlur(...args: unknown[]): unknown;
  attributes?: any[];
  reference?: any;
  options?: any[];
};

const AttributeField: FC<Props> = ({
  type,
  title,
  isRequired,
  isSet,
  isNestedSet,
  name,
  value,
  touched,
  errors,
  onChange,
  onBlur,
  attributes,
  reference,
  options,
}) => {
  const intl = useIntl();
  const { currencies, languages, dataLocale } = useApplicationContext(
    (context) => ({
      languages: context.project?.languages ?? [],
      currencies: context.project?.currencies ?? [],
      dataLocale: context.dataLocale ?? '',
    })
  );
  const [searchModalIndex, setSearchModalIndex] = useState<number | null>(null);

  const emptyValue = getValueByType(
    type,
    attributes,
    reference,
    currencies,
    languages
  );
  const selectOptions =
    type === TYPES.LocalizedEnum
      ? options?.map((option) => ({
        value: option.value,
        label: option.label[dataLocale],
      }))
      : options;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <>
      {isSet ? (
        <FieldArray
          name={name}
          render={({ push, remove, form }) => {
            const handleSelect = (selectedId: string) => {
              const newItem = {
                typeId: 'key-value-document',
                key: selectedId,
              };

              const updatedValue = [...(value || [])];
              const emptyIndex = updatedValue.findIndex(
                (item: any) => item?.key === ''
              );

              if (emptyIndex !== -1) {
                updatedValue[emptyIndex] = newItem;
              } else {
                updatedValue.push(newItem);
              }

              form.setFieldValue(name, updatedValue);
              setSearchModalIndex(null);
            };

            const handleDragEnd = (event: DragEndEvent) => {
              const { active, over } = event;
              if (active.id !== over?.id) {
                const oldIndex = active.data.current?.sortable.index;
                const newIndex = over?.data.current?.sortable.index;

                if (
                  typeof oldIndex === 'number' &&
                  typeof newIndex === 'number'
                ) {
                  const updated = arrayMove(value, oldIndex, newIndex);
                  form.setFieldValue(name, updated);
                }
              }
            };

            return (
              <Spacings.Stack scale="s">
                <AttributeLabel
                  data-testid="set-attribute-label"
                  type={type}
                  title={title}
                  isRequired={isRequired}
                  reference={reference}
                />
                <Constraints.Horizontal max="scale">
                  <SecondaryButton
                    data-testid="add-attribute"
                    iconLeft={<PlusBoldIcon />}
                    label={intl.formatMessage(messages.addLabel)}
                    onClick={() => push(emptyValue)}
                  />
                </Constraints.Horizontal>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={value?.map((_: any, i: number) => `${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {value?.map((val: any, index: number) => (
                      <SortableItem key={index} id={`${index}`}>
                        <Card
                          theme={isNestedSet ? 'light' : 'dark'}
                          type="flat"
                        >
                          <Spacings.Inline alignItems="center">
                            <div className={styles.fullWidth}>
                              <AttributeInput
                                data-testid={`set-attribute-input-${index}`}
                                type={type}
                                title={title}
                                name={`${name}.${index}`}
                                value={val}
                                touched={get(touched, index)}
                                errors={get(errors, index)}
                                onChange={onChange}
                                onBlur={onBlur}
                                isRequired={isRequired}
                                isSet={isSet}
                                isNestedSet={isNestedSet}
                                attributes={attributes}
                                reference={reference}
                                options={selectOptions}
                              />
                            </div>
                            <SecondaryIconButton
                              icon={val.key ? <EyeIcon /> : <SearchIcon />}
                              label="Search"
                              onClick={() => setSearchModalIndex(index)}
                            />
                            <SecondaryIconButton
                              data-testid={`remove-attribute-${index}`}
                              icon={<BinLinearIcon />}
                              label={intl.formatMessage(messages.removeLabel)}
                              isDisabled={index === 0 && value.length === 1}
                              onClick={() => remove(index)}
                            />
                          </Spacings.Inline>
                        </Card>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                {searchModalIndex !== null && (
                  <CustomObjectsModal
                    isOpen={searchModalIndex !== null}
                    close={() => setSearchModalIndex(null)}
                    handleSelect={handleSelect}
                    objectId={value?.[searchModalIndex]?.key}
                  />
                )}
              </Spacings.Stack>
            );
          }}
        />
      ) : (
        <Spacings.Stack scale="xs">
          <AttributeLabel
            data-testid="single-attribute-label"
            type={type}
            title={title}
            isRequired={isRequired}
            reference={reference}
          />
          <AttributeInput
            data-testid="single-attribute-input"
            type={type}
            title={title}
            name={name}
            value={value}
            touched={touched}
            errors={errors}
            onChange={onChange}
            onBlur={onBlur}
            isRequired={isRequired}
            isSet={isSet}
            attributes={attributes}
            reference={reference}
            options={selectOptions}
          />
        </Spacings.Stack>
      )}
    </>
  );
};
AttributeField.displayName = 'AttributeField';

export default AttributeField;
