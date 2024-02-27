---
layout: default
title: Data Model
nav_order: 3
---

<!--prettier-ignore-start-->
## Data Model
{: .no_toc }

1. TOC 
{:toc}

<!--prettier-ignore-end-->

### Container Schema

Container schemas are
[Custom Objects](https://docs.commercetools.com/api/projects/custom-objects).

- **container** - `mc-custom-object-schema`
- **key** - String, matching the pattern `[-_~.a-zA-Z0-9]+` - Required
- **value** - Object
  - **attributes** - Array of [Attribute](#attribute) - Required

<!--prettier-ignore-start-->
#### Attribute
{: .no_toc }
<!--prettier-ignore-end-->

- **name** - String - Required\
  Displayed in [start case](https://lodash.com/docs/4.17.15#startCase) in the Custom
  Object form as form field titles. Saved in schema as [kebab case](https://lodash.com/docs/4.17.15#kebabCase).
- **type** - [Type](#type) - Required\
  The type of the attribute. Determines the Custom Object form field input type.
- **set** - Boolean\
  Flag indicating if the attribute is an array/set.
- **required** - Boolean\
  Flag indicating if the attribute is required.
- **display** - Boolean\
  Flag indicating if the attribute should be displayed in the [Custom Object List](#custom-object-list)
  Value column
- **attributes** - Array of [Attribute](#attribute) - Required when `type` is
  Object
- **reference** - [Reference](#reference) - Required when `type` is Reference
- **enum** - Array of [Enum](#enum) - Required when `type` is List (enum)
- **lenum** - Array of [LocalizedEnum](#localizedenum) - Required when `type` is
  Localized List (enum)

<!--prettier-ignore-start-->
#### Type
{: .no_toc }
<!--prettier-ignore-end-->

List of available types.

- Text
- [Localized Text](https://docs.commercetools.com/api/types#localizedstring)
- Number
- Boolean
- [Money](https://docs.commercetools.com/api/types#moneys)
- [Date](https://docs.commercetools.com/api/types#date)
- [Time](https://docs.commercetools.com/api/types#time)
- [Date and time](https://docs.commercetools.com/api/types#datetime)
- List (enum)
- Localized List (enum)
- [Reference](https://docs.commercetools.com/api/types#reference)
  by ID or key
- Object

<!--prettier-ignore-start-->
#### Reference
{: .no_toc }
<!--prettier-ignore-end-->

- **by** - Enum (id, key)
- **type** -
  [ReferenceType](https://docs.commercetools.com/api/types#reference)

<!--prettier-ignore-start-->
#### Enum
{: .no_toc }
<!--prettier-ignore-end-->

- **value** - String - Required
- **label** - String - Required\
  The display text.

<!--prettier-ignore-start-->
#### LocalizedEnum
{: .no_toc }
<!--prettier-ignore-end-->

- **value** - String - Required
- **label** -
  [LocalizedString](https://docs.commercetools.com/api/types#localizedstring) -
  Required

![Schema Data Model](assets/schema-data-model.png)

<!--prettier-ignore-start-->
#### Example Data
{: .no_toc }
<!--prettier-ignore-end-->

```json
{
  "id": "a372c000-9f4c-4b8a-9e13-8d2e64f51bcd",
  "version": 1,
  "container": "mc-custom-object-schema",
  "key": "example-schema",
  "value": {
    "attributes": [
      {
        "attributes": [
          {
            "display": true,
            "reference": { "type": "product", "by": "id" },
            "required": true,
            "set": false,
            "type": "Reference",
            "name": "product"
          },
          { "required": false, "set": true, "type": "String", "name": "text" }
        ],
        "display": false,
        "required": false,
        "set": false,
        "type": "Object",
        "name": "object"
      },
      {
        "display": true,
        "enum": [
          { "label": "one", "value": "1" },
          { "label": "two", "value": "2" }
        ],
        "required": false,
        "set": false,
        "type": "Enum",
        "name": "list"
      },
      {
        "lenum": [
          { "label": { "de": "one (de)", "en": "one" }, "value": "1" },
          { "label": { "de": "two (de)", "en": "two" }, "value": "2" }
        ],
        "required": false,
        "set": false,
        "type": "LocalizedEnum",
        "name": "localized list"
      }
    ]
  },
  "createdAt": "2024-01-02T15:25:52.545Z",
  "lastModifiedAt": "2024-01-02T15:25:52.545Z",
  "lastModifiedBy": {
    "isPlatformClient": true,
    "user": { "typeId": "user", "id": "a372c000-9f4c-4b8a-9e13-8d2e64f51bcd" }
  },
  "createdBy": {
    "isPlatformClient": true,
    "user": { "typeId": "user", "id": "a372c000-9f4c-4b8a-9e13-8d2e64f51bcd" }
  }
}
```

### Custom Object

- **container** - String\
  The key of a [container schema](#container-schema).
- **key** - String, matching the pattern `[-_~.a-zA-Z0-9]+` - Required
- **value** - Object\
  Dynamically determined based on the schema's attributes. The object's keys are
  the [attribute's](#attribute) name in [kebab case](https://lodash.com/docs/4.17.15#kebabCase).

![Custom Object Data Model](assets/custom-object-data-model.png)

<!--prettier-ignore-start-->
#### Example Data
{: .no_toc }
<!--prettier-ignore-end-->

```json
{
  "id": "a372c000-9f4c-4b8a-9e13-8d2e64f51bcd",
  "version": 1,
  "container": "example-schema",
  "key": "example-custom-object",
  "value": {
    "localizedList": "1",
    "list": "2",
    "object": {
      "text": ["hello", "world"],
      "product": {
        "id": "a372c000-9f4c-4b8a-9e13-8d2e64f51bcd",
        "typeId": "product"
      }
    }
  },
  "createdAt": "2024-01-02T15:28:57.702Z",
  "lastModifiedAt": "2024-01-02T15:28:57.702Z",
  "lastModifiedBy": {
    "isPlatformClient": true,
    "user": { "typeId": "user", "id": "a372c000-9f4c-4b8a-9e13-8d2e64f51bcd" }
  },
  "createdBy": {
    "isPlatformClient": true,
    "user": { "typeId": "user", "id": "a372c000-9f4c-4b8a-9e13-8d2e64f51bcd" }
  }
}
```
