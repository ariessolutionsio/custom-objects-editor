import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'AllCustomObjectsList.title',
    description: 'The page title of the custom object list view',
    defaultMessage: 'View All Undefined Custom Objects',
  },
  titleResults: {
    id: 'AllCustomObjectsList.title.results',
    description: 'Custom object title result total',
    defaultMessage: '{total} results',
  },
  createCustomObject: {
    id: 'AllCustomObjectsList.button.createCustomObject',
    description: 'Label for the button to create a custom object',
    defaultMessage: 'Create a custom object',
  },
  container: {
    id: 'AllCustomObjectsList.filter.container',
    description: 'The placeholder for the container filter input',
    defaultMessage: 'Container',
  },
  key: {
    id: 'AllCustomObjectsList.filter.key',
    description: 'The placeholder for the key filter input',
    defaultMessage: 'Search by container/key/predicate',
  },
  filterButton: {
    id: 'AllCustomObjectsList.filter.button.label',
    description: 'Text for search button label',
    defaultMessage: 'Filter',
  },
  clearButton: {
    id: 'AllCustomObjectsList.filter.clear.label',
    description: 'Text for clear filter label',
    defaultMessage: 'Clear filter',
  },
  filter: {
    id: 'AllCustomObjectsList.filter.label',
    description: 'Label for filter',
    defaultMessage: 'Filter:',
  },
  clear: {
    id: 'AllCustomObjectsList.clear.label',
    description: 'Label for clear',
    defaultMessage: 'Clear',
  },
  errorNoContainers: {
    id: 'AllCustomObjectsList.error.noContainers',
    description: 'Error title when no containers exist on project',
    defaultMessage: 'No container schemas found on this project.',
  },
  errorCreateContainerLink: {
    id: 'AllCustomObjectsList.error.noContainers.link',
    description: 'Link title when no containers exist on project',
    defaultMessage: 'Create a container.',
  },
  errorLoading: {
    id: 'AllCustomObjectsList.error.loading',
    description: 'Error title when querying for custom objects fails',
    defaultMessage: 'Something went wrong loading the custom objects.',
  },
  errorNoResults: {
    id: 'AllCustomObjectsList.error.noResults',
    description: 'Error title when no results are returned',
    defaultMessage:
      'No custom objects found on this project.',
  },
  containerColumn: {
    id: 'AllCustomObjectsList.column.container',
    description: 'The label for the container column',
    defaultMessage: 'Container',
  },
  keyColumn: {
    id: 'AllCustomObjectsList.column.key',
    description: 'The label for the key column',
    defaultMessage: 'Key',
  },
  search:{
    id: 'AllCustomObjectsList.search.label',
    description: 'Label for Search',
    defaultMessage: 'Search:',
  },
  valueColumn: {
    id: 'AllCustomObjectsList.column.value',
    description: 'The label for the value column',
    defaultMessage: 'Value',
  },
  lastModifiedAtColumn: {
    id: 'AllCustomObjectsList.column.lastModified',
    description: 'The label for the last modified at column',
    defaultMessage: 'Last Modified',
  },
});
