import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'CreateCustomObject.title',
    description: 'The page title of create custom object',
    defaultMessage: 'Create a custom object',
  },
  backButton: {
    id: 'CreateCustomObject.button.back',
    description: 'Label for back button',
    defaultMessage: 'To custom objects list',
  },
  createSuccess: {
    id: 'CreateCustomObject.form.message.success',
    description: 'Success message for create custom object',
    defaultMessage: 'Your custom object has been created.',
  },
  createError: {
    id: 'CreateCustomObject.message.create.error',
    description: 'Error message for creating custom object',
    defaultMessage:
      'Something went wrong. The custom object was not created. {message}',
  },
});
