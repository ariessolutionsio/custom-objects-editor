import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import TextFilter from './text-filter';

const mocks = {
  value: '',
  onChange: jest.fn((value) => {
    return;
  }),
  onSubmit: jest.fn(),
};

//const filterWrapper = 'filter-wrapper';
const filterInput = 'filter-input';
const clearButton = 'clear-button';
const filterButton = 'filter-button';

const loadTextFilter = () =>
  render(
    <IntlProvider locale="en">
      <TextFilter {...mocks} />
    </IntlProvider>
  );

describe('text filter', () => {
  describe('when no value entered', () => {
    it('should not display clear button', () => {
      expect(loadTextFilter().queryByTestId(clearButton)).toBeNull();
    });

    it('should display filter button', () => {
      expect(loadTextFilter().getByTestId(filterButton)).not.toBeNull();
    });
  });

  describe('when value entered', () => {
    const newFilter = 'new query';

    //   beforeEach(() => {
    //     wrapper = loadTextFilter();
    //     wrapper
    //       .find(filterInput)
    //       .simulate('change', { target: { value: newFilter } });
    //   });

    it('should update filter value', () => {
      const input = loadTextFilter().getByTestId(
        filterInput
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: newFilter } });
      expect(mocks.onChange).toHaveBeenCalledWith(newFilter);
    });

    // it('should autofocus input', () => {
    //expect(wrapper.find(filterInput).prop('isAutofocussed')).toEqual(true);
    // });

    //   it('should display filter button', () => {
    //     expect(wrapper.find(filterButton).exists()).toEqual(true);
    //   });

    //   it('should not display clear button', () => {
    //     expect(wrapper.find(clearButton).exists()).toEqual(false);
    //   });

    //   describe('when filter is performed', () => {
    //     beforeEach(() => {
    //       wrapper.find(filterButton).simulate('click');
    //     });

    //     it('should display clear button', () => {
    //       expect(wrapper.find(clearButton).exists()).toEqual(true);
    //     });

    //     it('when clear button clicked, should clear filter input', () => {
    //       wrapper.find(clearButton).simulate('click');
    //       expect(wrapper.find(filterInput).prop('value')).toEqual('');
    //     });
    //   });

    //   it('when enter pressed in input, should perform filter', () => {
    //     wrapper.find(filterWrapper).simulate('keypress', { key: ENTER });
    //     expect(wrapper.find(clearButton).exists()).toEqual(true);
    //   });

    //   it('when non-enter pressed in input, should not perform filter', () => {
    //     wrapper.find(filterWrapper).simulate('keypress', { key: 'a' });
    //     expect(wrapper.find(clearButton).exists()).toEqual(false);
    //   });
  });
});
