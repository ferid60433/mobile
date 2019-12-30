/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PrescriptionCartRow } from './PrescriptionCartRow';

import { SUSSOL_ORANGE, WHITE } from '../globalStyles/index';

import { recordKeyExtractor } from '../pages/dataTableUtilities';
import { removeItem, updateDirection } from '../reducers/PrescriptionReducer';

/**
 * Layout container component for a prescriptions item cart.
 *
 * Pass a `Transaction.items` array and a callback which updates
 * a transactionItems quantity.
 *
 * @prop {Array} items             The current prescriptions items
 * @prop {Func}  onChangeQuantity  Callback when an items quantity is updated.
 * @prop {Func}  onOptionSelection Callback when an option in the dropdown is selected.
 * @prop {Func}  onRemoveItem      Callback when this row is removed.
 */
export const PrescriptionCartComponent = ({
  items,
  onChangeQuantity,
  onOptionSelection,
  onRemoveItem,
}) => {
  const renderPrescriptionCartRow = React.useCallback(
    ({ item }) => (
      <PrescriptionCartRow
        onChangeQuantity={onChangeQuantity}
        transactionItem={item}
        onOptionSelection={onOptionSelection}
        onRemoveItem={onRemoveItem}
      />
    ),
    [onChangeQuantity]
  );

  return (
    <View style={localStyles.containerStyle}>
      <Text style={localStyles.titleStyles}>Order</Text>
      <View style={localStyles.flexNine}>
        <FlatList
          keyExtractor={recordKeyExtractor}
          data={items}
          renderItem={renderPrescriptionCartRow}
        />
      </View>
    </View>
  );
};

PrescriptionCartComponent.propTypes = {
  items: PropTypes.array.isRequired,
  onChangeQuantity: PropTypes.func.isRequired,
  onOptionSelection: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};

const localStyles = StyleSheet.create({
  containerStyle: {
    elevation: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: WHITE,
    marginBottom: 10,
  },
  titleStyles: {
    color: SUSSOL_ORANGE,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: SUSSOL_ORANGE,
    marginVertical: 5,
  },
  flexNine: { flex: 9 },
});

const mapDispatchToProps = dispatch => ({
  onRemoveItem: id => dispatch(removeItem(id)),
  onOptionSelection: (id, newValue) => dispatch(updateDirection(id, newValue)),
  dispatch,
});

export const PrescriptionCart = connect(null, mapDispatchToProps)(PrescriptionCartComponent);