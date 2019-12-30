/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { CircleButton } from './CircleButton';
import { DropdownRow } from './DropdownRow';
import { DetailRow } from './DetailRow';
import { StepperRow } from './StepperRow';
import { CloseIcon } from './icons';
import { Separator } from './Separator';
import { TouchableNoFeedback } from './DataTable';

import { UIDatabase } from '../database';

/**
 * Renders a row in the PrescriptionCart consisting of a `StepperRow`, `DropdownRow`,
 * `DetailsRow` and a close button.
 *
 * Is passed all details needed as this is a simple layout and presentation component.
 *
 * @prop {Object} transactionItem
 * @prop {Func}   onChangeQuantity
 * @prop {Func}   onRemoveItem
 * @prop {Array}  options
 * @prop {Func}   onOptionSelection
 */
export const PrescriptionCartRow = ({
  transactionItem,
  onChangeQuantity,
  onRemoveItem,
  onOptionSelection,
}) => {
  const { itemName, totalQuantity, itemCode, price, id, note, item } = transactionItem;

  const itemDetails = React.useMemo(
    () => [
      { label: 'Code', text: itemCode },
      { label: 'Price', text: price },
    ],
    [itemCode, price]
  );

  const removeItem = React.useCallback(() => onRemoveItem(id), [id]);
  const onChangeValue = React.useCallback(quantity => onChangeQuantity(id, quantity), [id]);
  const selectionCallback = React.useCallback(direction => onOptionSelection(id, direction), [id]);
  const defaultDirections = React.useMemo(() => item.getDirectionExpansions(UIDatabase), [item.id]);

  return (
    <>
      <TouchableNoFeedback style={localStyles.flexRow}>
        <View style={localStyles.largeFlexRow}>
          <StepperRow text={itemName} quantity={totalQuantity} onChangeValue={onChangeValue} />
          <DetailRow details={itemDetails} />
          <View style={{ height: 10 }} />
          <DropdownRow
            currentOptionText={note}
            options={defaultDirections}
            onSelection={selectionCallback}
            dropdownTitle="Directions"
            placeholder="Usage direction"
          />
        </View>
        <View style={localStyles.flexOne} />
        <CircleButton IconComponent={CloseIcon} onPress={removeItem} />
      </TouchableNoFeedback>
      <Separator width={1} />
    </>
  );
};

PrescriptionCartRow.propTypes = {
  transactionItem: PropTypes.object.isRequired,
  onChangeQuantity: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onOptionSelection: PropTypes.func.isRequired,
};

const localStyles = StyleSheet.create({
  flexRow: { flex: 1, flexDirection: 'row' },
  largeFlexRow: { flex: 10 },
  flexOne: { flex: 1 },
  centerFlex: { flex: 1, justifyContent: 'center' },
  closeContainerStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});