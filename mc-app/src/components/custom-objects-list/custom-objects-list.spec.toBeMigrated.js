/* eslint-disable import/no-unresolved */
import React from 'react';
import { shallow } from 'enzyme';
import faker from 'faker';
import camelCase from 'lodash/camelCase';
import first from 'lodash/first';
import last from 'lodash/last';
import startCase from 'lodash/startCase';
import times from 'lodash/times';
import moment from 'moment';
import { stringify } from 'qs';
import { FormattedDate } from 'react-intl';
import { useQuery, setQuery } from '@commercetools-frontend/application-shell';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import PaginatedTable from '../paginated-table/paginated-table';
import useEffectMock from '../../test-utils/use-effect-mock';
import {
  generateAttribute,
  generateContainer,
  generateContainerContext,
  generateCustomObject,
} from '../../test-utils';
import * as ContainerContext from '../../context/container-context';
import { TYPES } from '../container-form/constants';
import GetCustomObjects from '../get-custom-objects.ctp.graphql';
import { SORT_OPTIONS } from '../../constants';
import CustomObjectsList from './custom-objects-list';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DEFAULT_VARIABLES,
  PAGE_SIZE,
} from './constants';
import { COLUMN_KEYS } from './column-definitions';

const containerContext = generateContainerContext();

const generateCustomObjects = (
  total = faker.random.number({ min: 1, max: 10 })
) => ({
  customObjects: {
    count: total,
    total,
    offset: 0,
    results: times(total, () =>
      generateCustomObject(first(containerContext.containers))
    ),
  },
});

const mocks = {
  match: {
    url: faker.internet.url(),
  },
  history: {
    push: jest.fn(),
  },
};

const createButton = '[data-testid="create-custom-object"]';
const containerFilter = '[data-testid="container-filter"]';
const keyFilter = '[data-testid="key-filter"]';
const noContainerError = '[data-testid="no-containers-error"]';

const containerContextSpy = jest.spyOn(ContainerContext, 'useContainerContext');

const loadCustomObjectsList = () => shallow(<CustomObjectsList {...mocks} />);

describe('custom objects list', () => {
  beforeAll(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(useEffectMock);
  });

  beforeEach(() => {
    containerContextSpy.mockReturnValue(containerContext);
    useQuery.mockClear();
  });

  it('should retrieve custom objects', () => {
    loadCustomObjectsList();
    expect(useQuery).toHaveBeenCalledWith(GetCustomObjects, {
      variables: {
        queryString: stringify({
          ...DEFAULT_VARIABLES,
          sort: `${COLUMN_KEYS.MODIFIED} ${SORT_OPTIONS.DESC}`,
          where: containerContext.where,
        }),
      },
      skip: false,
    });
  });

  it('should display title', () => {
    const wrapper = loadCustomObjectsList();
    expect(wrapper.find('[data-testid="title"]').exists()).toEqual(true);
  });

  describe('when custom object query fails', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ error: { message: 'failed to load' } });
      wrapper = loadCustomObjectsList();
    });

    it('should display error message', () => {
      expect(wrapper.find('[data-testid="loading-error"]').exists()).toEqual(
        true
      );
    });

    it('should not display custom object list', () => {
      expect(wrapper.find(PaginatedTable).exists()).toEqual(false);
    });
  });

  describe('when custom object query returns data', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ data: generateCustomObjects() });
      wrapper = loadCustomObjectsList();
    });

    it('should display result count', () => {
      expect(wrapper.find('[data-testid="subtitle"]').exists()).toEqual(true);
    });

    it('should display custom object list', () => {
      expect(wrapper.find(PaginatedTable).exists()).toEqual(true);
    });
  });

  describe('when custom object returns an empty list', () => {
    let wrapper;
    beforeEach(() => {
      setQuery({ data: generateCustomObjects(0) });
      wrapper = loadCustomObjectsList();
    });

    it('should not display result count', () => {
      expect(wrapper.find('[data-testid="subtitle"]').exists()).toEqual(false);
    });

    it('should not display custom object list', () => {
      expect(wrapper.find(PaginatedTable).exists()).toEqual(false);
    });

    it('should display error message', () => {
      expect(wrapper.find('[data-testid="no-results-error"]').exists()).toEqual(
        true
      );
    });
  });

  describe('list columns', () => {
    const data = generateCustomObjects();

    it('should render fallback for default column', () => {
      setQuery({ data });
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0 });
      expect(actual).toEqual(NO_VALUE_FALLBACK);
    });

    it('should render custom object container for container column', () => {
      setQuery({ data });
      const { container } = first(data.customObjects.results);
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.CONTAINER });
      expect(actual).toEqual(container);
    });

    it('should render custom object key for key column', () => {
      setQuery({ data });
      const { key } = first(data.customObjects.results);
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.KEY });
      expect(actual).toEqual(key);
    });

    it('should render custom object last modified date for last modified column', () => {
      setQuery({ data });
      const { lastModifiedAt } = first(data.customObjects.results);
      const wrapper = loadCustomObjectsList();
      const actual = wrapper
        .find(PaginatedTable)
        .props()
        .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.MODIFIED });
      expect(actual.props.value).toEqual(lastModifiedAt);
    });

    describe('value column', () => {
      const valueKey = camelCase(faker.random.words());

      const renderValueColumn = (value) => {
        const customObject = {
          ...generateCustomObject(first(containerContext.containers)),
          value: {
            [valueKey]: value,
          },
        };
        const results = {
          customObjects: {
            total: 1,
            count: 1,
            offset: 0,
            results: [customObject],
          },
        };
        setQuery({ data: results });
        const wrapper = loadCustomObjectsList();
        return shallow(
          wrapper
            .find(PaginatedTable)
            .props()
            .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALUE })
        );
      };

      it('should render custom object key in start case format', () => {
        const actual = renderValueColumn('');
        expect(actual.find('[data-testid="value-title"]').html()).toContain(
          startCase(valueKey)
        );
      });

      it('when custom object key value is a string, should render string value', () => {
        const value = faker.random.words();
        const actual = renderValueColumn(value);
        expect(actual.text()).toContain(value);
      });

      it('when custom object key value is a number, should render number as string value', () => {
        const value = faker.random.number({ min: 1, max: 10 });
        const actual = renderValueColumn(value);
        expect(actual.text()).toContain(value);
      });

      it('when custom object key value is a date, should render formatted date', () => {
        const value = moment(faker.date.recent()).format('YYYY-MM-DD');
        const actual = renderValueColumn(value);
        expect(actual.find(FormattedDate).props()).toEqual({
          value,
          ...DATE_FORMAT,
        });
      });

      it('when custom object key value is a datetime, should render formatted datetime', () => {
        const value = faker.date.recent().toISOString();
        const actual = renderValueColumn(value);
        expect(actual.find(FormattedDate).props()).toEqual({
          value,
          ...DATE_TIME_FORMAT,
        });
      });

      it('when custom object key value is a time, should render time as a string value', () => {
        const value = moment(faker.date.recent()).format('h:mm A');
        const actual = renderValueColumn(value);
        expect(actual.text()).toContain(value);
      });

      it('when custom object key value is a boolean, should render boolean value as string value', () => {
        const value = faker.random.boolean();
        const actual = renderValueColumn(value);
        expect(actual.text()).toContain(value);
      });

      it('when custom object key value is an object, should render object values', () => {
        const value = faker.random.boolean();
        const actual = renderValueColumn({ value });
        expect(actual.find('[data-testid="object-value"]').exists()).toEqual(
          true
        );
      });

      it('when custom object key value is an array, should render each list item', () => {
        const value = faker.random.boolean();
        const list = [value, value];
        const actual = renderValueColumn(list);
        expect(actual.find('[data-testid="list-value"]').length).toEqual(
          list.length
        );
      });

      describe('display attribute in list', () => {
        function renderValueColumnWithContext(attributes) {
          const container = generateContainer(attributes);
          const context = generateContainerContext([container]);
          containerContextSpy.mockReset();
          containerContextSpy.mockReturnValue(context);
          const customObject = generateCustomObject(container);
          const results = {
            customObjects: {
              total: 1,
              count: 1,
              offset: 0,
              results: [customObject],
            },
          };
          setQuery({ data: results });
          const wrapper = loadCustomObjectsList();
          return shallow(
            wrapper
              .find(PaginatedTable)
              .props()
              .itemRenderer({ rowIndex: 0, columnKey: COLUMN_KEYS.VALUE })
          );
        }
        const attributeValue = '[data-testid="custom-object-value"] > div';

        it('when container schema has one display in list attribute, should only display that attribute', () => {
          const attributes = [
            generateAttribute({ display: true }),
            generateAttribute({ display: false, displayNested: false }),
          ];
          const actual = renderValueColumnWithContext(attributes);
          expect(actual.find(attributeValue).length).toEqual(1);
        });

        it('when container schema has no display in list attributes, should display all available attribute', () => {
          const attributes = times(2, () =>
            generateAttribute({ display: false, displayNested: false })
          );
          const actual = renderValueColumnWithContext(attributes);
          expect(actual.find(attributeValue).length).toEqual(attributes.length);
        });

        it('when container schema has object attribute with nested display in list attributes', () => {
          const attribute = generateAttribute({
            type: TYPES.Object,
            display: false,
            displayNested: true,
            set: false,
          });
          const attributes = [attribute];
          const actual = renderValueColumnWithContext(attributes);
          expect(
            actual.find(
              `${attributeValue} > [data-testid="object-value"] > div`
            ).length
          ).toEqual(attribute.attributes.length);
        });
      });
    });
  });

  describe('container filter', () => {
    const value = 'container-search';
    let wrapper;

    beforeEach(() => {
      setQuery({ data: generateCustomObjects() });
      wrapper = loadCustomObjectsList();
    });

    it('when container selected, should query for custom objects in selected container', () => {
      wrapper.find(containerFilter).props().onChange({ target: { value } });
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.queryString).toContain(
        stringify(`where=container="${value}"`)
      );
    });

    it('when container cleared, should query for custom objects in all managed containers', () => {
      wrapper
        .find(containerFilter)
        .props()
        .onChange({ target: { value: '' } });
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.queryString).toContain(
        stringify(`where=${containerContext.where}`)
      );
    });
  });

  describe('key filter', () => {
    const value = 'key-search';
    let wrapper;

    beforeEach(() => {
      setQuery({ data: generateCustomObjects() });
      wrapper = loadCustomObjectsList();
    });

    it('when key filter entered, should query for custom objects with key value', () => {
      wrapper.find(keyFilter).props().onSubmit(value);
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.queryString).toContain(
        stringify(`where=key="${value}"`)
      );
    });

    it('when container cleared, should query for custom objects in all managed containers', () => {
      wrapper.find(keyFilter).props().onSubmit('');
      const result = last(useQuery.mock.calls)[1];
      expect(result.variables.queryString).toContain(
        stringify(`where=${containerContext.where}`)
      );
    });
  });

  it('when next pagination button clicked, should query for next page', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper.find(PaginatedTable).props().next();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.queryString).toContain(
      stringify(`offset=${PAGE_SIZE}`)
    );
  });

  // In the UI, clicking previous on the first page is disallowed, but for ease of testing
  // that's what is happening here, hence the strange expectation.
  it('when previous pagination button clicked, should query for previous page', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper.find(PaginatedTable).props().previous();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.queryString).toContain(
      stringify(`offset=-${PAGE_SIZE}`)
    );
  });

  it('when table column sort direction clicked, should update table sort order', () => {
    setQuery({ data: generateCustomObjects() });
    const wrapper = loadCustomObjectsList();
    wrapper
      .find(PaginatedTable)
      .props()
      .onSortChange(COLUMN_KEYS.MODIFIED, SORT_OPTIONS.DESC);
    wrapper.update();
    const result = last(useQuery.mock.calls)[1];
    expect(result.variables.queryString).toContain(
      stringify(`sort=${COLUMN_KEYS.MODIFIED} ${SORT_OPTIONS.DESC}`)
    );
  });

  it('when row clicked, should open custom object details', () => {
    const data = generateCustomObjects(1);
    const customObject = data.customObjects.results[0];
    setQuery({ data });
    const wrapper = loadCustomObjectsList();
    wrapper.find(PaginatedTable).props().onRowClick({}, 0);
    expect(mocks.history.push).toHaveBeenCalledWith(
      `${mocks.match.url}/${customObject.id}/general`
    );
  });

  describe('when container context has containers', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = loadCustomObjectsList();
    });

    it('should display container filter', () => {
      expect(wrapper.find(containerFilter).exists()).toEqual(true);
    });

    it('should display key filter', () => {
      expect(wrapper.find(keyFilter).exists()).toEqual(true);
    });

    it('should display create custom object button', () => {
      expect(wrapper.find(createButton).exists()).toEqual(true);
    });

    it('should not display no container error', () => {
      expect(wrapper.find(noContainerError).exists()).toEqual(false);
    });
  });

  describe('when container context has no containers', () => {
    let wrapper;

    beforeEach(() => {
      containerContextSpy.mockReset();
      containerContextSpy.mockReturnValue({
        hasContainers: false,
        containers: [],
        where: '',
      });
    });

    beforeEach(() => {
      wrapper = loadCustomObjectsList();
    });

    it('should not display container filter', () => {
      expect(wrapper.find(containerFilter).exists()).toEqual(false);
    });

    it('should not display create custom object button', () => {
      expect(wrapper.find(createButton).exists()).toEqual(false);
    });

    it('should display no container error', () => {
      expect(wrapper.find(noContainerError).exists()).toEqual(true);
    });
  });
});
