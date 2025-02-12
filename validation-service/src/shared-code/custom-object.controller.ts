import { ApolloContextValue } from '@apollo/client';
import { AttributeSchema, CustomObject, Schema } from './types/validator';
import Create from './queries/create-custom-object';
import Get from './queries/get-custom-object';
import { GraphQLClient } from './types/graphql';
import { referenceTypeToSingleValueMap } from './constants/map-types';
import { getEntityById } from './queries/get-entity-by-id';
import { getEntityByKey } from './queries/get-entity-by-key';

const SCHEMA_CONTAINER = 'mc-custom-object-schema';
export class CustomObjectController {
  private apolloClient?: GraphQLClient;
  private context?: ApolloContextValue;

  constructor(
    apolloClient?: GraphQLClient,
    context?: ApolloContextValue & { target: string }
  ) {
    this.apolloClient = apolloClient;
    this.context = context;
  }

  async fetchCustomObject(
    container: string,
    key: string
  ): Promise<CustomObject | undefined> {
    try {
      const response = await this.apolloClient
        ?.query({
          query: Get,
          variables: { container, key },
          ...(this.context && { context: this.context }),
        })
        .then((res) => {
          return res.data as { customObject: CustomObject };
        });
      return response?.customObject;
    } catch (error) {
      console.error('Error fetching custom object:', error);
      return undefined;
    }
  }

  async createOrUpdateCustomObject(
    container: string,
    key: string,
    value: string,
    schemaType: string
  ): Promise<CustomObject | undefined> {
    const jsonValue = JSON.parse(value);
    await this.validateObjectBySchemaType(jsonValue, schemaType);

    const response = await this.apolloClient
      ?.mutate({
        mutation: Create,
        variables: {
          draft: {
            container,
            key,
            value,
          },
        },
        ...(this.context && { context: this.context }),
      })
      .then((res) => {
        return res.data as CustomObject;
      });

    return response;
  }

  private async validateObjectBySchemaType(
    value: Record<string, any>,
    schemaType: string
  ): Promise<void> {
    if (schemaType === SCHEMA_CONTAINER) {
      return;
    }
    const schemaObject = await this.fetchCustomObject(
      SCHEMA_CONTAINER,
      schemaType
    );

    if (!schemaObject) {
      throw new Error(`Schema not found for type: ${schemaType}`);
    }
    await this.validateObjectSchema(schemaObject.value, value);
  }

  private async validateObjectSchema(
    schema: Schema,
    value: Record<string, any>
  ) {
    for (const attributeSchema of schema.attributes) {
      const attributeValue = value[attributeSchema.name];

      if (attributeSchema.required && attributeValue === undefined) {
        throw new Error(`Required attribute missing: ${attributeSchema.name}`);
      }

      if (attributeValue != null) {
        await this.validateAttribute(attributeSchema, attributeValue);
      }
    }
  }

  public async validateAttribute(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    switch (schema.type) {
      case 'Boolean':
        await this.validateBoolean(schema, value);
        break;
      case 'String':
        await this.validateString(schema, value);
        break;
      case 'LocalizedString':
        await this.validateLocalizedString(schema, value);
        break;
      case 'Number':
        await this.validateNumber(schema, value);
        break;
      case 'Date':
        await this.validateDate(schema, value);
        break;
      case 'Enum':
        await this.validateEnum(schema, value);
        break;
      case 'LocalizedEnum':
        await this.validateLocalizedEnum(schema, value);
        break;
      case 'Money':
        await this.validateMoney(schema, value);
        break;
      case 'Time':
        await this.validateTime(schema, value);
        break;
      case 'DateTime':
        await this.validateDateTime(schema, value);
        break;
      case 'Reference':
        await this.validateReference(schema, value);
        break;
      case 'Object':
        await this.validateObject(schema, value);
        break;
      default:
        throw new Error(`Unsupported type for attribute: ${schema.name}`);
    }
  }

  private async validateSet(
    schema: AttributeSchema,
    value: any,
    cbFuncName: string
  ): Promise<void> {
    if (!schema.required && (typeof value === 'undefined' || value === null)) {
      return;
    } else if (!Array.isArray(value)) {
      throw new Error(
        `Invalid type for set attribute: ${
          schema.name
        }. Expected Array, got ${typeof value}`
      );
    }
    for (const item of value) {
      // @ts-ignore
      this[cbFuncName] &&
        // @ts-ignore
        (await this[cbFuncName](
          {
            ...schema,
            set: false,
          },
          item
        ));
    }
  }

  private async validateBoolean(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateBoolean');
    } else {
      if (schema.required && typeof value !== 'boolean') {
        throw new Error(
          `Invalid type for attribute: ${
            schema.name
          }. Expected Boolean, got ${typeof value}`
        );
      }
    }
  }

  private async validateString(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateString');
    } else {
      if (schema.required && typeof value !== 'string') {
        throw new Error(
          `Invalid type for attribute: ${
            schema.name
          }. Expected String, got ${typeof value}`
        );
      }
    }
  }

  private async validateNumber(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateNumber');
    } else {
      if (schema.required && typeof value !== 'number') {
        throw new Error(
          `Invalid type for attribute: ${
            schema.name
          }. Expected Number, got ${typeof value}`
        );
      }
    }
  }

  private async validateEnum(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateEnum');
    } else {
      if (!schema.required && !value) {
        return;
      }

      if (!schema.enum?.some((enumValue) => enumValue.value === value)) {
        throw new Error(
          `Invalid enum value for attribute: ${schema.name}. Value: ${value}`
        );
      }

      if (schema.required && typeof value !== 'string') {
        throw new Error(
          `Invalid type for enum attribute: ${
            schema.name
          }. Expected String, got ${typeof value}`
        );
      }
    }
  }
  private async validateLocalizedEnum(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateLocalizedEnum');
    } else {
      if (!schema.required && !value) {
        return;
      }

      if (!schema.lenum?.some((enumValue) => enumValue.value === value)) {
        throw new Error(
          `Invalid enum value for attribute: ${schema.name}. Value: ${value}`
        );
      }

      if (schema.required && typeof value !== 'string') {
        throw new Error(
          `Invalid type for enum attribute: ${
            schema.name
          }. Expected String, got ${typeof value}`
        );
      }
    }
  }

  private async validateReference(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateReference');
    } else {
      if (!schema.required && !value) {
        return;
      }
      if (typeof value !== 'object' || !value) {
        throw new Error(
          `Invalid type for reference attribute: ${
            schema.name
          }. Expected object, got ${typeof value}`
        );
      }

      const referenceValue = value as Record<string, unknown>;
      const typeId = referenceValue.typeId as string;
      const id = referenceValue.id as string;
      const key = referenceValue.key as string;

      if (!typeId) {
        throw new Error(
          `Invalid reference value for attribute: ${schema.name}. Missing typeId`
        );
      }
      if (schema.required && !id && !key) {
        throw new Error(
          `Invalid reference value for attribute: ${schema.name}. Missing id or key`
        );
      }

      if (!schema.reference || typeId !== schema.reference.type) {
        throw new Error(
          `Invalid reference type for attribute: ${schema.name}. Expected ${schema.reference?.type}, got ${typeId}`
        );
      }
      await this.validateReferenceValue(typeId, id, key);
    }
  }

  private async validateMoney(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateMoney');
    } else {
      if (!schema.required && !value) {
        return;
      }
      if (
        typeof value.amount !== 'string' ||
        typeof value.currencyCode !== 'string'
      ) {
        throw new Error(
          `Invalid type for attribute: ${
            schema.name
          }. Expected Money, got ${typeof value}`
        );
      }
      if (isNaN(parseInt(value.amount))) {
        throw new Error(
          `Invalid type for attribute: ${
            schema.name
          }. Expected amount, got ${typeof value.amount}`
        );
      }
    }
  }
  private async validateTime(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateTime');
    } else {
      if (!schema.required && !value) {
        return;
      }

      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9] ([AP]M)$/;
      if (typeof value !== 'string' || !value.match(timeRegex)) {
        throw new Error(
          `Invalid value for attribute: ${schema.name}. Expected Time in format HH:mm AM/PM, got ${value}`
        );
      }
    }
  }
  private async validateDateTime(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateDateTime');
    } else {
      if (!schema.required && !value) {
        return;
      }
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      if (typeof value !== 'string' || !value.match(dateTimeRegex)) {
        throw new Error(
          `Invalid value for attribute: ${schema.name}. Expected DateTime in format yyyy-mm-ddTHH:mm:ss.sssZ, got ${value}`
        );
      }
    }
  }
  private async validateDate(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateDate');
    } else {
      if (!schema.required && !value) {
        return;
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (typeof value !== 'string' || !value.match(dateRegex)) {
        throw new Error(
          `Invalid value for attribute: ${schema.name}. Expected Date in format MM/DD/YYYY, got ${value}`
        );
      }
    }
  }

  private async validateLocalizedString(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateLocalizedString');
    } else {
      if (!schema.required && !value) {
        return;
      }
      if (typeof value !== 'object' || value === null) {
        throw new Error(
          `Invalid type for attribute: ${
            schema.name
          }. Expected LocalizedString, got ${typeof value}`
        );
      }
      if (Object.keys(value).length === 0) {
        throw new Error(
          `Invalid type for attribute: ${schema.name}. Expected LocalizedString is empty`
        );
      }
      if (schema.required) {
        if (
          !Object.keys(value).some(
            (key) => typeof value[key] !== undefined || value[key] !== ''
          )
        ) {
          throw new Error(`Required attribute missing: ${schema.name}`);
        }
      }
    }
  }

  private async validateObject(
    schema: AttributeSchema,
    value: any
  ): Promise<void> {
    if (schema.set) {
      await this.validateSet(schema, value, 'validateObject');
    } else {
      if (!schema.required && !value) {
        return;
      }
      if (typeof value !== 'object' || !value) {
        throw new Error(
          `Invalid type for attribute: ${
            schema.name
          }. Expected Object, got ${typeof value}`
        );
      }
      if (schema.attributes?.length) {
        await this.validateObjectSchema(
          {
            attributes: schema.attributes,
          },
          value
        );
      }
    }
  }

  private async validateReferenceValue(
    typeId: string,
    id?: string,
    key?: string
  ): Promise<void> {
    if (!id && !key){
      return;
    }
    const singleValueQueryDataObject = referenceTypeToSingleValueMap[typeId]
      ? referenceTypeToSingleValueMap[typeId]
      : typeId;

    const query = id
      ? getEntityById(singleValueQueryDataObject)
      : getEntityByKey(singleValueQueryDataObject);

    await this.apolloClient
      ?.query({
        query: query,
        variables: id ? { id } : { key },
        ...(this.context && { context: this.context }),
      }).then((res) => {
        if (!(res.data as any)[singleValueQueryDataObject]) {
          throw new Error(
            `Invalid reference value for attribute: ${typeId}. The expected ${typeId} was not found`
          );
        }
      });
  }
}
