export const referenceTypeToSingleValueMap: Record<string, string> = {
    'cart-discount': 'cartDiscount',
    'product-discount': 'productDiscount',
    'customer-group': 'customerGroup',
    'discount-code': 'discountCode',
    'key-value-document': 'customObject',
    'product-type': 'productType',
    'tax-category': 'taxCategory',
    'shopping-list': 'shoppingList',
    'shipping-method': 'shippingMethod',
    type: 'typeDefinition',
    'product-price': 'standalonePrice',
  };

  export const referenceTypeSkipKey: string[] = [
      'order'
  ]