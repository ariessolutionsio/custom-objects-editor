/* eslint-disable import/no-unresolved */
import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import kebabCase from 'lodash/kebabCase';
import { FormattedMessage } from 'react-intl';
import {
  getMutation,
  setMutation,
} from '@commercetools-frontend/application-shell';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { ROOT_PATH } from '../../constants';
import * as ContainerContext from '../../context/container-context';
import { generateContainerContext } from '../../test-utils';
import CreateCustomObjectMutation from '../update-custom-object.rest.graphql';
import CustomObjectForm from '../custom-object-form';
import CreateCustomObject from './create-custom-object';
import messages from './messages';

const containerContext = generateContainerContext();

const formValues = {
  container: kebabCase(faker.random.words()),
};

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

const loadCreateCustomObject = () => shallow(<CreateCustomObject {...mocks} />);

describe('create custom object', () => {
  const submitForm = async (wrapper, values = formValues) =>
    wrapper.find(CustomObjectForm).props().onSubmit(values);

  beforeEach(() => {
    jest
      .spyOn(ContainerContext, 'useContainerContext')
      .mockImplementation(() => containerContext);
    mockShowNotification.mockClear();
    mocks.history.push.mockClear();
  });

  it('when form submitted, should create container with form values', () => {
    setMutation({ loading: true });
    const wrapper = loadCreateCustomObject();
    const mutation = getMutation(CreateCustomObjectMutation);
    submitForm(wrapper);
    expect(mutation).toHaveBeenCalledWith({
      variables: {
        body: formValues,
      },
    });
  });

  it('when create container fails, should show error message', async () => {
    const error = { message: 'failed' };
    setMutation({ error });
    const wrapper = loadCreateCustomObject();
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
      wrapper = loadCreateCustomObject();
      await submitForm(wrapper);
    });

    it('should display success message', () => {
      expect(mockShowNotification).toHaveBeenCalledWith({
        text: <FormattedMessage {...messages.createSuccess} />,
      });
    });

    it('should redirect to main route', () => {
      expect(mocks.history.push).toHaveBeenCalledWith(
        `/${mocks.match.params.projectKey}/${ROOT_PATH}`
      );
    });
  });
});
