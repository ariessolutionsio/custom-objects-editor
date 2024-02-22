import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'ContainerList.title',
    description: 'The page title of the container list view',
    defaultMessage: 'Container Schema Manager',
  },
  titleResults: {
    id: 'ContainerList.title.results',
    description: 'Custom object title result total',
    defaultMessage: '{total} {total, plural, one {result} other {results}}',
  },
  createContainer: {
    id: 'ContainerList.button.createContainer',
    description: 'Label for the button to create an container',
    defaultMessage: 'Create container schema',
  },
  errorLoading: {
    id: 'ContainerList.error.loading',
    description: 'Error title when querying for containers fails',
    defaultMessage: 'Something went wrong loading the containers.',
  },
  errorNoResults: {
    id: 'ContainerList.error.noResults',
    description: 'Error title when no results are returned',
    defaultMessage: 'No container schemas found on this project.',
  },
  attributesLabel: {
    id: 'ContainerList.label.attributes',
    description: 'The attributes label',
    defaultMessage:
      '({total} {total, plural, one {attribute} other {attributes}})',
  },
  newestFirstLabel: {
    id: 'ContainerList.sort.label.newestFirst',
    description: 'The newest first sort option label',
    defaultMessage: 'Newest first',
  },
  oldestFirstLabel: {
    id: 'ContainerList.sort.label.oldestFirst',
    description: 'The oldest first sort option label',
    defaultMessage: 'Oldest first',
  },
  lastModifiedLabel: {
    id: 'ContainerList.sort.label.lastModified',
    description: 'The last modified sort option labell',
    defaultMessage: 'Last modified',
  },
  alphabeticalAscLabel: {
    id: 'ContainerList.sort.label.alphabeticalAsc',
    description: 'The ascending alphabetical sort option label',
    defaultMessage: 'Alphabetical (asc)',
  },
  alphabeticalDescLabel: {
    id: 'ContainerList.sort.label.alphabeticalDesc',
    description: 'The descending alphabetical sort option label',
    defaultMessage: 'Alphabetical (desc)',
  },
});
