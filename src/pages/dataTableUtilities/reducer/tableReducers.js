/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import { sortDataBy } from '../../../utilities';

/**
 * Sorts the current set of data by the provided
 * key and direction in action.
 *
 * sortBy: String key of the field of the objects to sort by, see sortDataBy.js
 */
export const sortData = (state, action) => {
  const { data, isAscending, sortBy } = state;
  const { payload } = action;
  const { sortBy: newSortBy } = payload;

  // If the new sortBy is the same as the sortBy in state, then invert isAscending
  // that was set by the last sortBy action. Otherwise, default to true.
  const newIsAscending = newSortBy === sortBy ? !isAscending : true;

  const newData = sortDataBy(data, newSortBy, newIsAscending);

  return { ...state, data: newData, sortBy: newSortBy, isAscending: newIsAscending };
};

/**
 * Filters the backingData WITH REALM, returning a JS array. Sorting
 * is held stable.
 */
export const filterData = (state, action) => {
  const { backingData, filterDataKeys, sortBy, isAscending } = state;
  const { payload } = action;
  const { searchTerm } = payload;

  const queryString = filterDataKeys.map(filterTerm => `${filterTerm} CONTAINS[c] $0`).join(' OR ');

  const filteredData = backingData.filtered(queryString, searchTerm.trim()).slice();

  return {
    ...state,
    data: sortBy ? sortDataBy(filteredData, sortBy, isAscending) : filteredData,
    searchTerm,
  };
};

/**
 * Filters the backingData with REALM - first applying the finalised filtering
 * returning a JS array. Sorting is held stable.
 *
 */
export const filterDataWithFinalisedToggle = (state, action) => {
  const { backingData, filterDataKeys, sortBy, isAscending, showFinalised } = state;
  const { payload } = action;
  const { searchTerm } = payload;

  // Filter by toggle status - showing or not showing finalised records.
  const finalisedCondition = showFinalised ? '==' : '!=';
  const statusFilteredData = backingData.filtered(`status ${finalisedCondition} $0`, 'finalised');

  // Apply query filtering
  const queryString = filterDataKeys.map(filterTerm => `${filterTerm} CONTAINS[c] $0`).join(' OR ');
  const queryFilteredData = statusFilteredData.filtered(queryString, searchTerm.trim()).slice();

  // Sort the data by the current sorting parameters.
  const sortedData = sortBy
    ? sortDataBy(queryFilteredData, sortBy, isAscending)
    : statusFilteredData;

  return { ...state, data: sortedData, searchTerm };
};

/**
 * Filters the backingData with REALM - first applying show/hide over stock filtering
 * toggle. Sorting is held stable.
 *
 */
export const filterDataWithOverStockToggle = (state, action) => {
  const { backingData, filterDataKeys, sortBy, isAscending, showAll } = state;
  const { payload } = action;
  const { searchTerm } = payload;

  // Apply query filtering
  const queryString = filterDataKeys.map(filterTerm => `${filterTerm} CONTAINS[c] $0`).join(' OR ');
  const queryFilteredData = backingData.filtered(queryString, searchTerm.trim()).slice();

  // Filter by toggle status - showing or not showing over stocked records.
  const stockFilteredData = !showAll
    ? queryFilteredData.slice().filter(item => item.isLessThanThresholdMOS)
    : queryFilteredData.slice();

  // Sort the data by the current sorting parameters.
  const sortedData = sortBy
    ? sortDataBy(stockFilteredData, sortBy, isAscending)
    : stockFilteredData;

  return { ...state, data: sortedData, searchTerm };
};

/**
 * Simply refresh's the data object in state to correctly match the
 * backingData. Used for when side effects such as finalizing manipulate
 * the state of a page from outside the reducer.
 */
export const refreshData = state => {
  const { backingData, sortBy, isAscending } = state;

  const backingDataArray = backingData.slice();
  const newData = sortBy ? sortDataBy(backingDataArray, sortBy, isAscending) : backingDataArray;

  return { ...state, data: newData, searchTerm: '', showAll: true };
};

/**
 * Override for refreshData for pages which use a finalised toggle,
 * which will display either finalised records, or unfinalised.
 */
export const refreshDataWithFinalisedToggle = state => {
  const { backingData, sortBy, isAscending, showFinalised } = state;

  const finalisedCondition = showFinalised ? '==' : '!=';
  const filteredData = backingData.filtered(`status ${finalisedCondition} $0`, 'finalised');

  const newData = sortBy ? sortDataBy(filteredData.slice(), sortBy, isAscending) : filteredData;

  return { ...state, data: newData, searchTerm: '', showAll: true };
};

/**
 * Filters `backingData` by status, setting `data` as all elements whose
 * status is finalised.
 */
export const showFinalised = state => {
  const { backingData, sortBy, isAscending } = state;

  const filteredData = backingData.filtered('status == $0', 'finalised').slice();

  const sortedData = sortBy ? sortDataBy(filteredData, sortBy, isAscending) : filteredData;

  return { ...state, data: sortedData, showFinalised: true, searchTerm: '' };
};

/**
 * Filters `backingData` by status, setting `data` as all elements whose
 * status is not finalised.
 */
export const showNotFinalised = state => {
  const { backingData, sortBy, isAscending } = state;

  const filteredData = backingData.filtered('status != $0', 'finalised').slice();

  const sortedData = sortBy ? sortDataBy(filteredData, sortBy, isAscending) : filteredData;

  return { ...state, data: sortedData, showFinalised: false };
};

/**
 * Filters backingData by the elements isLessThanThresholdMOS field.
 */
export const hideOverStocked = state => {
  const { backingData } = state;

  const newData = backingData.filter(item => item.isLessThanThresholdMOS);

  return { ...state, data: newData, showAll: false };
};

/**
 * Filters by backingData elements `hasStock` field.
 */
export const hideStockOut = state => {
  const { backingData } = state;

  const newData = backingData.filter(item => item.hasStock);

  return { ...state, data: newData, showAll: false, searchTerm: '' };
};

/**
 * Creates adds the passed record to the HEAD of the current
 * data array.
 *
 * Also removes the current sorting and filter.
 */
export const addRecord = (state, action) => {
  const { backingData } = state;
  const { payload } = action;
  const { record } = payload;

  return {
    ...state,
    data: [record, ...backingData.slice(0, backingData.length - 1)],
    modalKey: '',
    sortBy: '',
    searchTerm: '',
  };
};

export const TableReducerLookup = {
  hideStockOut,
  showNotFinalised,
  showFinalised,
  addRecord,
  hideOverStocked,
  refreshData,
  filterData,
  sortData,
  refreshDataWithFinalisedToggle,
  filterDataWithFinalisedToggle,
  filterDataWithOverStockToggle,
};