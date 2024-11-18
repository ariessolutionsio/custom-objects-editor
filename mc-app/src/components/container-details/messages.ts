import { defineMessages } from 'react-intl';

export default defineMessages({
  backButton: {
    id: 'ContainerDetails.button.back',
    description: 'Label for back button',
    defaultMessage: 'To Container Schemas list',
  },
  generalTab: {
    id: 'ContainerDetails.tabs.general',
    description: 'Label for general tab',
    defaultMessage: 'General',
  },
  deleteContainer: {
    id: 'ContainerDetails.button.deleteContainer',
    description: 'Label for delete container button',
    defaultMessage: 'Delete Container',
  },
  deleteContainerConfirmation: {
    id: 'ContainerDetails.message.deleteContainerConfirm',
    description: 'Delete container confirmation message',
    defaultMessage: 'Are you sure you want to delete this container?',
  },
  deleteSuccess: {
    id: 'ContainerDetails.message.delete.success',
    description: 'Success message for deleting container',
    defaultMessage: 'Your container has been deleted.',
  },
  deleteError: {
    id: 'ContainerDetails.message.delete.error',
    description: 'Error message for deleting container',
    defaultMessage: 'Something went wrong. Your container was not deleted.',
  },
  errorLoading: {
    id: 'ContainerDetails.error.loading.title',
    description: 'Error title when querying for container fails',
    defaultMessage: 'Something went wrong loading the container.',
  },
  editSuccess: {
    id: 'EditContainer.form.message.edit.success',
    description: 'Success message for editing container',
    defaultMessage: 'Your container has been saved.',
  },
  editError: {
    id: 'EditContainer.form.message.edit.error',
    description: 'Error message for editing container',
    defaultMessage:
      'Something went wrong. Your container was not saved. {message}',
  },
});
