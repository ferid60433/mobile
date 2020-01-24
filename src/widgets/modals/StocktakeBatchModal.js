/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect, batch } from 'react-redux';

import { MODAL_KEYS } from '../../utilities';
import { usePageReducer } from '../../hooks';
import { getItemLayout } from '../../pages/dataTableUtilities';

import { GenericChoiceList } from '../modalChildren/GenericChoiceList';
import { PageInfo, DataTablePageView, PageButton } from '..';
import { DataTable, DataTableHeaderRow, DataTableRow } from '../DataTable';

import globalStyles from '../../globalStyles';

import { UIDatabase } from '../../database';
import ModalContainer from './ModalContainer';
import { buttonStrings } from '../../localization/index';
import { ROUTES } from '../../navigation/constants';

/**
 * Renders a stateful modal with a stocktake item and it's batches loaded
 * for editing.
 *
 * State:
 * Uses a reducer to manage state with `backingData` being a realm results
 * of items to display. `data` is a plain JS array of realm objects. data is
 * hydrated from the `backingData` for displaying in the interface.
 * i.e: When filtering, data is populated from filtered items of `backingData`.
 *
 * dataState is a simple map of objects corresponding to a row being displayed,
 * holding the state of a given row. Each object has the shape :
 * { isSelected, isFocused, isDisabled },
 *
 * @prop {Object} stocktakeItem The realm transaction object for this invoice.
 *
 */
export const StocktakeBatchModalComponent = ({ stocktakeItem, reduxDispatch }) => {
  const usingReasons = useMemo(
    () =>
      UIDatabase.objects('NegativeAdjustmentReason').length > 0 &&
      UIDatabase.objects('PositiveAdjustmentReason').length > 0,
    []
  );

  const initialState = {
    page: usingReasons ? 'stocktakeBatchEditModalWithReasons' : 'stocktakeBatchEditModal',
    pageObject: stocktakeItem,
  };

  const [state, dispatch, instantDebouncedDispatch] = usePageReducer(initialState);

  const {
    pageObject,
    data,
    dataState,
    sortKey,
    isAscending,
    modalKey,
    modalValue,
    keyExtractor,
    PageActions,
    columns,
    getPageInfoColumns,
  } = state;

  const { stocktake = {} } = stocktakeItem;
  const { isFinalised = false } = stocktake;
  const { difference = 0 } = modalValue || {};

  const reasonsSelection =
    difference > 0
      ? UIDatabase.objects('PositiveAdjustmentReason')
      : UIDatabase.objects('NegativeAdjustmentReason');

  const onCloseModal = () => dispatch(PageActions.closeModal());
  const onApplyReason = ({ item }) => dispatch(PageActions.applyReason(item));
  const onAddBatch = () => dispatch(PageActions.addStocktakeBatch());
  const onEditBatch = (value, rowKey, columnKey) =>
    dispatch(PageActions.editStocktakeBatchName(value, rowKey, columnKey));
  const onEditReason = rowKey =>
    batch(() => {
      dispatch(PageActions.openModal(MODAL_KEYS.STOCKTAKE_REASON, rowKey));
      reduxDispatch(PageActions.refreshRow(stocktakeItem.id, ROUTES.STOCKTAKE_EDITOR));
    });
  const onEditCountedQuantity = (newValue, rowKey, columnKey) =>
    batch(() => {
      dispatch(PageActions.editStocktakeBatchCountedQuantity(newValue, rowKey, columnKey));
      reduxDispatch(PageActions.refreshRow(stocktakeItem.id, ROUTES.STOCKTAKE_EDITOR));
    });
  const onEditDate = (date, rowKey, columnKey) =>
    dispatch(PageActions.editTransactionBatchExpiryDate(date, rowKey, columnKey));

  const toggles = useCallback(getPageInfoColumns(pageObject, dispatch, PageActions), []);

  const getCallback = useCallback(colKey => {
    switch (colKey) {
      case 'countedTotalQuantity':
        return onEditCountedQuantity;
      case 'batch':
        return onEditBatch;
      case 'expiryDate':
        return onEditDate;
      case 'reasonTitle':
        return onEditReason;
      default:
        return null;
    }
  }, []);

  const renderRow = useCallback(
    listItem => {
      const { item, index } = listItem;
      const rowKey = keyExtractor(item);
      return (
        <DataTableRow
          rowData={data[index]}
          rowState={dataState.get(rowKey)}
          rowKey={rowKey}
          columns={columns}
          getCallback={getCallback}
          rowIndex={index}
          isFinalised={isFinalised}
        />
      );
    },
    [data, dataState]
  );

  const renderHeader = useCallback(
    () => (
      <DataTableHeaderRow
        columns={columns}
        dispatch={instantDebouncedDispatch}
        sortAction={PageActions.sortData}
        isAscending={isAscending}
        sortKey={sortKey}
      />
    ),
    [sortKey, isAscending]
  );

  const {
    pageTopSectionContainer,
    pageTopLeftSectionContainer,
    pageTopRightSectionContainer,
  } = globalStyles;
  return (
    <DataTablePageView>
      <View style={pageTopSectionContainer}>
        <View style={pageTopLeftSectionContainer}>
          <PageInfo columns={toggles} />
        </View>
        <View style={pageTopRightSectionContainer}>
          <PageButton
            text={buttonStrings.add_batch}
            onPress={onAddBatch}
            isDisabled={isFinalised}
          />
        </View>
      </View>
      <DataTable
        data={data}
        extraData={dataState}
        renderRow={renderRow}
        renderHeader={renderHeader}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        columns={columns}
        windowSize={1}
        initialNumToRender={0}
      />
      <ModalContainer
        fullScreen={modalKey === MODAL_KEYS.ENFORCE_STOCKTAKE_REASON}
        isVisible={!!modalKey}
        onClose={onCloseModal}
      >
        <GenericChoiceList
          data={reasonsSelection}
          highlightValue={(modalValue && modalValue.reasonTitle) || ''}
          keyToDisplay="title"
          onPress={onApplyReason}
        />
      </ModalContainer>
    </DataTablePageView>
  );
};

StocktakeBatchModalComponent.propTypes = {
  stocktakeItem: PropTypes.object.isRequired,
  reduxDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({ reduxDispatch: dispatch });

export const StocktakeBatchModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(StocktakeBatchModalComponent);
