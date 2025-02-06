/* eslint-disable import/no-unresolved */
import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router';
import {
  getMutation,
  setMutation,
  setQuery,
  useQuery,
} from '@commercetools-frontend/application-shell';
import { mockShowNotification } from '@commercetools-frontend/actions-global';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import ViewHeader from '../view-header';
import { generateContainer } from '../../test-utils';
import { ROOT_PATH } from '../../constants';
import GetContainer from '../get-custom-object.rest.graphql';
import DeleteContainer from '../delete-custom-object.rest.graphql';
import ContainerDetails from './container-details';
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

const loadContainerDetails = () => shallow(<ContainerDetails {...mocks} />);

describe('container details', () => {
  beforeEach(() => {
    mockShowNotification.mockClear();
  });

  it('should query for container by id', () => {
    loadContainerDetails();
    expect(useQuery).toHaveBeenCalledWith(GetContainer, {
      variables: { id: mocks.match.params.id },
    });
  });

  it('when container query fails, should display error message', () => {
    setQuery({ error: { message: 'failed to load' } });
    const wrapper = loadContainerDetails();
    expect(wrapper.find('[data-testid="loading-error"]').exists()).toEqual(
      true
    );
  });

  it('when container query returns data, should display edit container form', () => {
    setQuery({ data: { customObject: generateContainer() } });
    const wrapper = loadContainerDetails();
    expect(wrapper.find(Route).prop('path')).toEqual(
      `${mocks.match.url}/general`
    );
  });

  describe('delete container', () => {
    const container = generateContainer();

    const loadCommands = (wrapper) =>
      shallow(wrapper.find(ViewHeader).prop('commands'));

    beforeEach(() => {
      setQuery({ data: { customObject: container } });
    });

    it('when dialog confirm button clicked, should remove asset', async () => {
      setMutation({ loading: true });
      const wrapper = loadContainerDetails();
      const commands = loadCommands(wrapper);
      const mutation = getMutation(DeleteContainer);
      await commands.find(ConfirmationDialog).props().onConfirm();

      expect(mutation).toHaveBeenCalledWith({
        variables: { version: container.version },
      });
    });

    describe('when bundle delete completes successfully', () => {
      beforeEach(async () => {
        setMutation({ data: {} });
        const wrapper = loadContainerDetails();
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
          `/${mocks.match.params.projectKey}/${ROOT_PATH}/containers`
        );
      });
    });

    describe('when bundle delete fails', () => {
      let commands;

      beforeEach(() => {
        setMutation({ error: { message: 'error' } });
        const wrapper = loadContainerDetails();
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
