import { sequence, fake, Generator } from '@commercetools-test-data/core';
import { ClientLogging } from '@commercetools-test-data/commons';
import { createRelatedDates } from '@commercetools-test-data/utils';
import type { CustomObject } from '@commercetools/platform-sdk';

const [getOlderDate, getNewerDate] = createRelatedDates();

// https://docs.commercetools.com/api/projects/channels#channel
const generator = Generator<CustomObject>({
  fields: {
    id: fake((f) => f.datatype.uuid()),
    key: fake((f) => f.lorem.slug(2)),
    version: sequence(),
    createdAt: fake(getOlderDate),
    lastModifiedAt: fake(getNewerDate),
    createdBy: fake(() => ClientLogging.random()),
    lastModifiedBy: fake(() => ClientLogging.random()),
    container: '',
    value: '',
  },
});

export default generator;
