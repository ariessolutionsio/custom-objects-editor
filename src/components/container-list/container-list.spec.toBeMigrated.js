/* eslint-disable import/no-unresolved */
import React from 'react';
import { shallow } from 'enzyme';
import last from 'lodash/last';
import faker from 'faker';
import { setQuery, useQuery } from '@commercetools-frontend/application-shell';
import SelectInput from '@commercetools-uikit/select-input';
import Grid from '@commercetools-uikit/grid';
import Pagination from '../pagination';
import ViewHeader from '../view-header';
import { generateContainers } from '../../test-utils';
import GetContainers from '../get-custom-objects.ctp.graphql';
import { SORT_OPTIONS } from '../../constants';
import ContainerList from './container-list';
import { DEFAULT_VARIABLES, FIELDS, PAGE_SIZE } from './constants';

const mocks = {
  match: {
    url: faker.internet.url(),
  },
};

const loadContainerList = () => shallow(<ContainerList {...mocks} />);

describe('container list', () => {
  it('should retrieve containers', () => {
    loadContainerList();
    expect(useQuery).toHaveBeenCalledWith(GetContainers, {
      variables: {
        ...DEFAULT_VARIABLES,
        sort: `${FIELDS.KEY} ${SORT_OPTIONS.ASC}`,
      },
    });
  });

  describe('when container query fails', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ error: { message: 'failed to load' } });
      wrapper = loadContainerList();
    });

    it('should display error message', () => {
      expect(wrapper.find('[data-testid="loading-error"]').exists()).toEqual(
        true
      );
    });

    it('should not display container list', () => {
      expect(wrapper.find(Grid).exists()).toEqual(false);
    });
  });

  describe('when container query returns data', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ data: generateContainers() });
      wrapper = loadContainerList();
    });

    it('should display result count', () => {
      const title = shallow(wrapper.find(ViewHeader).prop('title'));
      expect(title.find('[data-testid="total-results"]').exists()).toEqual(
        true
      );
    });

    it('should display container list', () => {
      expect(wrapper.find(Grid).exists()).toEqual(true);
    });
  });

  describe('when container query returns an empty list', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ data: generateContainers(0) });
      wrapper = loadContainerList();
    });

    it('should not display result count', () => {
      const title = shallow(wrapper.find(ViewHeader).prop('title'));
      expect(title.find('[data-testid="total-results"]').exists()).toEqual(
        false
      );
    });

    it('should not display custom object list', () => {
      expect(wrapper.find(Grid).exists()).toEqual(false);
    });

    it('should display error message', () => {
      expect(wrapper.find('[data-testid="no-results-error"]').exists()).toEqual(
        true
      );
    });
  });

  describe('container card', () => {
    const containers = generateContainers(1);
    const container = containers.customObjects.results[0];
    let wrapper;
    beforeEach(() => {
      setQuery({ data: containers });
      wrapper = loadContainerList();
    });

    it('should display container key', () => {
      expect(wrapper.find('[data-testid="container-key"]').html()).toContain(
        container.key
      );
    });

    it('should display number of container attributes', () => {
      expect(
        wrapper.find('[data-testid="container-attributes"]').prop('values')
      ).toEqual({ total: container.value.attributes.length });
    });
  });

  it('when next pagination button clicked, should query for next page', () => {
    setQuery({ data: generateContainers() });
    const wrapper = loadContainerList();
    wrapper.find(Pagination).props().next();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.offset).toEqual(PAGE_SIZE);
  });

  // In the UI, clicking previous on the first page is disallowed, but for ease of testing
  // that's what is happening here, hence the strange expectation.
  it('when previous pagination button clicked, should query for previous page', () => {
    setQuery({ data: generateContainers() });
    const wrapper = loadContainerList();
    wrapper.find(Pagination).props().previous();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.offset).toEqual(-PAGE_SIZE);
  });

  it('when table column sort direction clicked, should update table sort order', () => {
    setQuery({ data: generateContainers() });
    const wrapper = loadContainerList();
    const sort = `${FIELDS.CREATED} ${SORT_OPTIONS.DESC}`;
    wrapper
      .find(SelectInput)
      .props()
      .onChange({ target: { value: sort } });
    wrapper.update();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.sort).toEqual(sort);
  });
});
