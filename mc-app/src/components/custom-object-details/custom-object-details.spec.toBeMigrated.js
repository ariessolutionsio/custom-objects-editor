/* eslint-disable import/no-unresolved */
import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { Route } from 'react-router';
import {
  getMutation,
  setMutation,
  setQuery,
  useQuery,
} from '@commercetools-frontend/application-shell';
import { FormattedMessage } from 'react-intl';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import ViewHeader from '../view-header';
import { ROOT_PATH } from '../../constants';
import { generateCustomObject } from '../../test-utils';
import GetCustomObject from '../get-custom-object.rest.graphql';
import DeleteCustomObject from '../delete-custom-object.rest.graphql';
import CustomObjectDetails from './custom-object-details';
import messages from './messages';

const mocks = {
  match: {
    params: {
      id: faker.random.uuid(),
      projectKey: 'test-project',
    },
    url: faker.internet.url(),
  },
  history: {
    push: jest.fn(),
  },
};

const customObject = generateCustomObject();

const loadCustomObjectDetails = () =>
  shallow(<CustomObjectDetails {...mocks} />);

describe('custom object details', () => {
  it('should query for custom object by id', () => {
    loadCustomObjectDetails();
    expect(useQuery).toHaveBeenCalledWith(GetCustomObject, {
      variables: { id: mocks.match.params.id },
    });
  });

  it('when custom object query fails, should display error message', () => {
    setQuery({ error: { message: 'failed to load' } });
    const wrapper = loadCustomObjectDetails();
    expect(wrapper.find('[data-testid="loading-error"]').exists()).toEqual(
      true
    );
  });

  it('when custom object query returns data, should display edit custom object form', () => {
    setQuery({ data: { customObject } });
    const wrapper = loadCustomObjectDetails();
    expect(wrapper.find(Route).prop('path')).toEqual(
      `${mocks.match.url}/general`
    );
  });

  describe('delete custom object', () => {
    const loadCommands = (wrapper) =>
      shallow(wrapper.find(ViewHeader).prop('commands'));

    beforeEach(() => {
      setQuery({ data: { customObject } });
    });

    it('when dialog confirm button clicked, should remove asset', async () => {
      setMutation({ loading: true });
      const wrapper = loadCustomObjectDetails();
      const commands = loadCommands(wrapper);
      const mutation = getMutation(DeleteCustomObject);
      await commands.find(ConfirmationDialog).props().onConfirm();

      expect(mutation).toHaveBeenCalledWith({
        variables: { version: customObject.version },
      });
    });

    describe('when bundle delete completes successfully', () => {
      beforeEach(async () => {
        setMutation({ data: {} });
        const wrapper = loadCustomObjectDetails();
        const commands = loadCommands(wrapper);
        await commands.find(ConfirmationDialog).props().onConfirm();
      });

      it('should show success notification', () => {
        expect(mockShowNotification).toHaveBeenCalledWith({
          text: <FormattedMessage {...messages.deleteSuccess} />,
        });
      });

      it('should redirect to containers list', () => {
        expect(mocks.history.push).toHaveBeenCalledWith(
          `/${mocks.match.params.projectKey}/${ROOT_PATH}`
        );
      });
    });

    describe('when bundle delete fails', () => {
      let commands;

      beforeEach(() => {
        setMutation({ error: { message: 'error' } });
        const wrapper = loadCustomObjectDetails();
        commands = loadCommands(wrapper);
      });

      it('should show error notification', async () => {
        try {
          await commands.find(ConfirmationDialog).props().onConfirm();
        } catch (error) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(mockShowNotification).toHaveBeenCalledWith({
            text: <FormattedMessage {...messages.deleteError} />,
          });
        }
      });
    });
  });
});
