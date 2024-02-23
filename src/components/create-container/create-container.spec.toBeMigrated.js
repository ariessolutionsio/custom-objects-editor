/* eslint-disable import/no-unresolved */
import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import {
  getMutation,
  setMutation,
} from '@commercetools-frontend/application-shell';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { CONTAINER, ROOT_PATH } from '../../constants';
import ContainerForm from '../container-form';
import CreateContainerCustomObject from '../update-custom-object.rest.graphql';
import { generateFormValues } from '../../test-utils';
import CreateContainer from './create-container';
import messages from './messages';

const formValues = generateFormValues();

const mocks = {
  match: {
    params: {
      projectKey: 'test-project',
    },
  },
  history: {
    push: jest.fn(),
  },
};

const loadCreateContainer = () => shallow(<CreateContainer {...mocks} />);

describe('create container', () => {
  const submitForm = async (wrapper, values = formValues) =>
    wrapper.find(ContainerForm).props().onSubmit(values);

  beforeEach(() => {
    mockShowNotification.mockClear();
    mocks.history.push.mockClear();
  });

  it('when form submitted, should create container with form values', () => {
    setMutation({ loading: true });
    const wrapper = loadCreateContainer();
    const mutation = getMutation(CreateContainerCustomObject);
    submitForm(wrapper);
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        body: {
          container: CONTAINER,
          key: formValues.key,
          value: {
            attributes: formValues.attributes,
          },
        },
      },
    });
  });

  it('when create container fails, should show error message', async () => {
    const error = { message: 'failed' };
    setMutation({ error });
    const wrapper = loadCreateContainer();
    await submitForm(wrapper).catch(() =>
      // eslint-disable-next-line jest/no-conditional-expect
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: (
          <FormattedMessage
            {...messages.createError}
            values={{ message: error.message }}
          />
        ),
      })
    );
  });

  describe('when create container succeeds', () => {
    const data = {};
    let wrapper;

    beforeEach(async () => {
      setMutation({ data });
      wrapper = loadCreateContainer();
      await submitForm(wrapper);
    });

    it('should display success message', () => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: <FormattedMessage {...messages.createSuccess} />,
      });
    });

    it('should redirect to main route', () => {
      expect(mocks.history.push).toHaveBeenCalledWith(
        `/${mocks.match.params.projectKey}/${ROOT_PATH}/containers`
      );
    });
  });
});
