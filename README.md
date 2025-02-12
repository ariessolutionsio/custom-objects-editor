# Custom object editor

This repo is a [Connect](https://docs.commercetools.com/connect) repository that allows you to manage custom objects in commercetools platform. There are two connect-apps in this repo:

- `mc-app`: A React application for managing custom objects in commercetools platform.
- `validation-service`: A Node.js service for validating custom objects in commercetools platform.

## Instalation
Refer to [documentation](https://docs.commercetools.com/merchant-center/connect) for more information

## Development

### Prerequisites

- Node.js (version 18 or higher)
- Yarn (version 1.22 or higher)

### Local development

1. Clone the repository
2. Run `yarn install` in `mc-app` and `validation-service` directories to install all dependencies
3. Run `yarn start` in `mc-app` and `validation-service` directories to start the application
4. Refer to [documentation](https://docs.commercetools.com/connect/steps-locally-test-service) for more information

### Configuration
- [mc-app](./mc-app/README.md)
- [validation-service](./validation-service/README.md)


### TODO

- Add more references types:

    [ ] approval-flow
    References an ApprovalFlow.

    [ ] approval-rule
    References an ApprovalRule.

    [ ] associate-role
    References an AssociateRole.

    [ ] attribute-group
    References an AttributeGroup.

    [ ] business-unit
    References a BusinessUnit.

    [x] cart
    References a Cart.

    [x] cart-discount
    References a CartDiscount.

    [x] category
    References a Category.

    [x] channel
    References a Channel.

    [x] customer
    References a Customer.

    [ ] customer-email-token
    References a CustomerToken for email verification.

    [x] customer-group
    References a CustomerGroup.

    [ ] customer-password-token
    References a CustomerToken for password reset.

    [ ] direct-discount
    References a DirectDiscount.

    [x] discount-code
    References a DiscountCode.

    [ ] extension
    References an Extension.

    [ ] inventory-entry
    References an InventoryEntry.

    [x] key-value-document
    References a CustomObject.

    [x] order
    References an Order.

    [x] order-edit
    References an Order Edit.

    [x] payment
    References a Payment.

    [x] product
    References a Product.

    [x] product-discount
    References a ProductDiscount.

    [x] product-price
    References an Embedded Price.

    [ ] product-selection
    References a ProductSelection.

    [ ] product-tailoring
    References a ProductTailoring.

    [x] product-type
    References a ProductType.

    [ ] quote
    References a Quote.

    quote-request
    References a QuoteRequest.

    [ ] review
    References a Review.

    [x] shipping-method
    References a ShippingMethod.

    [x] shopping-list
    References a ShoppingList.

    [ ] staged-quote
    References a StagedQuote.

    [ ] standalone-price
    References a StandalonePrice.

    [x] state
    References a State.

    [x] store
    References a Store.

    [ ] subscription
    References a Subscription.

    [ ] tax-category
    References a TaxCategory.

    [x] type
    References a Type.

    [x] zone
    References a Zone.
