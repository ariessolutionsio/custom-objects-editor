import { Builder } from '@commercetools-test-data/core';
import type { CustomObject } from '@commercetools/platform-sdk';
import generator from './generator';
import transformers from './transformers';
import type { TCreateCustomObjectBuilder } from './types';

const Model: TCreateCustomObjectBuilder = () =>
  Builder<CustomObject>({
    generator,
    transformers,
  });

export default Model;
