# Validation Service

This is a Node.js-Express app that exposes a single endpoint to validate and create/update custom objects in Commercetools platform. The endpoint is accessible at `/validate`

## API

### POST /validate

Validate a custom object and create or update it in Commercetools platform.

#### Request body

The request body should contain the custom object to be validated and created/updated in the following format:
```
{
    "container": "Configuration",
    "key": "abandoned",
    "value": "{\"Name\":\"123ERER\",\"Key\":\"Chevy\",\"Value\":\"\"}",
    "schemaType": "Configuration"
}
```
The value field should be a JSON string. Refere to [custom object values](https://docs.commercetools.com/api/graphql#create-product-attributes-custom-fields-and-custom-objects) for more information.

