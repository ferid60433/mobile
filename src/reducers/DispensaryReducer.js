/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2020
 */

import { DISPENSARY_ACTIONS } from '../actions/DispensaryActions';
import { getColumns } from '../pages/dataTableUtilities';
import { UIDatabase } from '../database';

const initialState = () => ({
  searchTerm: '',
  sortKey: 'firstName',
  isAscending: true,
  dataSet: 'patient',
  columns: getColumns('patient'),
  data: UIDatabase.objects('Patient'),
});

export const DispensaryReducer = (state = initialState(), action) => {
  const { type } = action;

  switch (type) {
    case DISPENSARY_ACTIONS.FILTER: {
      const { payload } = action;
      const { searchTerm } = payload;

      return { ...state, searchTerm };
    }

    case DISPENSARY_ACTIONS.SORT: {
      const { isAscending, sortKey } = state;
      const { payload } = action;
      const { sortKey: newSortKey } = payload;

      const newIsAscending = sortKey === newSortKey ? !isAscending : true;

      return { ...state, sortKey: newSortKey, isAscending: newIsAscending };
    }

    case DISPENSARY_ACTIONS.SWITCH: {
      const { dataSet } = state;

      const newDataSet = dataSet === 'patient' ? 'prescriber' : 'patient';
      const newColumns = getColumns(newDataSet);
      const newData = UIDatabase.objects(newDataSet === 'patient' ? 'Patient' : 'Prescriber');

      return {
        ...state,
        dataSet: newDataSet,
        columns: newColumns,
        sortKey: 'firstName',
        isAscending: true,
        searchTerm: '',
        data: newData,
      };
    }

    default:
      return state;
  }
};
