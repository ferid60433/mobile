/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

import TouchableCell from './DataTable/TouchableCell';
import { CaretDown } from './icons';
import { newDataTableStyles } from '../globalStyles/index';

const {
  dropDownCellTextContainer,
  dropDownCellIconContainer,
  dropDownFont,
  dropDownPlaceholderFont,
} = newDataTableStyles;

/**
 * Simple wrapper around TouchableCell which renders a small amount of text and
 * an icon indicating some action. Renders N/A in a lighter font when no
 * value is passed.
 *
 * @param {Bool}    isDisabled      Indicator whether this cell is disabled.
 * @param {Func}    dispatch        Dispatching function to containing reducer.
 * @param {Func}    onPressAction   Action creator when pressed.
 * @param {String}  rowKey          Key for this cells row.
 * @param {String}  columnKey       Key for this cells column.
 * @param {String}  value           Text value for this cell.
 * @param {Bool}    isLastCell      Indicator whether this cell is the last cell in a row.
 * @param {Number}  width           Flex width of this cell.
 * @param {Bool}    debug           Indicator whether logging should occur for this cell.
 */
const DropDownCell = React.memo(
  ({ isDisabled, dispatch, onPressAction, rowKey, columnKey, value, isLastCell, width, debug }) => {
    const internalFontStyle = value ? dropDownFont : dropDownPlaceholderFont;

    const TouchableChild = () => (
      <View style={{ flexDirection: 'row' }}>
        <View style={dropDownCellTextContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={internalFontStyle}>
            {value || 'N/A'}
          </Text>
        </View>
        {!!value && (
          <View style={dropDownCellIconContainer}>
            <CaretDown />
          </View>
        )}
      </View>
    );

    return (
      <TouchableCell
        dispatch={dispatch}
        rowKey={rowKey}
        columnKey={columnKey}
        value={value}
        debug={debug}
        isLastCell={isLastCell}
        onPressAction={onPressAction}
        isDisabled={!value || isDisabled}
        width={width}
        renderChildren={TouchableChild}
        containerStyle={newDataTableStyles.touchableCellContainer}
      />
    );
  }
);

export default DropDownCell;
DropDownCell.defaultProps = {
  isDisabled: false,
  value: '',
  isLastCell: false,
  debug: false,
};
DropDownCell.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onPressAction: PropTypes.func.isRequired,
  rowKey: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
  isLastCell: PropTypes.bool,
  debug: PropTypes.bool,
};
