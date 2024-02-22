import { defineMessages } from 'react-intl';

export default defineMessages({
  backButton: {
    id: 'CustomObjectDetails.button.back',
    description: 'Label for back button',
    defaultMessage: 'To Custom Objects list',
  },
  errorLoading: {
    id: 'CustomObjectDetails.error.loading.title',
    description: 'Error title when querying for custom object fails',
    defaultMessage: 'Something went wrong loading the custom object.',
  },
  generalTab: {
    id: 'CustomObjectDetails.tabs.general',
    description: 'Label for general tab',
    defaultMessage: 'General',
  },
  deleteCustomObject: {
    id: 'CustomObjectDetails.button.deleteCustomObject',
    description: 'Label for delete custom object button',
    defaultMessage: 'Delete Custom Object',
  },
  deleteCustomObjectConfirmation: {
    id: 'CustomObjectDetails.message.deleteCustomObjectConfirm',
    description: 'Delete custom object confirmation message',
    defaultMessage: 'Are you sure you want to delete this custom object?',
  },
  deleteSuccess: {
    id: 'CustomObjectDetails.message.delete.success',
    description: 'Success message for deleting custom object',
    defaultMessage: 'Your custom object has been deleted.',
  },
  deleteError: {
    id: 'CustomObjectDetails.message.delete.error',
    description: 'Error message for deleting custom object',
    defaultMessage: 'Something went wrong. Your custom object was not deleted.',
  },
  editSuccess: {
    id: 'EditCustomObject.form.message.edit.success',
    description: 'Success message for editing custom object',
    defaultMessage: 'Your custom object has been saved.',
  },
  editError: {
    id: 'EditCustomObject.form.message.edit.error',
    description: 'Error message for editing custom object',
    defaultMessage:
      'Something went wrong. Your custom object was not saved. {message}',
  },
});
