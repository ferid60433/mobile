/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { FormLabel } from './FormLabel';
import { ToggleBar } from '../ToggleBar';
import { FlexView } from '../FlexView';
import { WARMER_GREY, SUSSOL_ORANGE } from '../../globalStyles';

/**
 * Form input of a toggle selection. Multiple toggles can be rendered, with
 * just one being selected.
 *
 * @prop {String} label         Label for this form input.
 * @prop {Array}  options       The underlying options to select from.
 * @prop {Array}  optionLabels  Array of labels for options i.e. ["Yes", "No"]
 * @prop {String} value         The current selected value.
 * @prop {Func}   onValueChange Callback after a toggle selection.
 * @prop {Bool}   isRequired    Indicator whether this form input is required.
 * @prop {Bool}   isDisabled    Indicator whether this form input is disabled.
 */
export const FormToggle = ({
  label,
  options,
  optionLabels,
  value,
  onValueChange,
  isRequired,
  isDisabled,
}) => {
  const toggles = React.useMemo(
    () =>
      options.map((option, index) => ({
        text: optionLabels[index],
        isOn: value === option,
        onPress: () => onValueChange(option, index),
      })),
    [options, onValueChange]
  );

  return (
    <FlexView flex={1}>
      <FormLabel value={label} isRequired={isRequired} />
      <ToggleBar
        isDisabled={isDisabled}
        toggles={toggles}
        style={localStyles.toggleMargin}
        toggleOnStyle={localStyles.toggleOnStyle}
        toggleOffStyle={localStyles.toggleOffStyle}
        toggleOnDisabledStyle={localStyles.toggleOnDisabledStyle}
      />
    </FlexView>
  );
};

const localStyles = StyleSheet.create({
  toggleMargin: { marginTop: 20 },
  toggleOnStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SUSSOL_ORANGE,
  },
  toggleOffStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  toggleOnDisabledStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WARMER_GREY,
  },
});

FormToggle.defaultProps = {
  isRequired: false,
  isDisabled: false,
};

FormToggle.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  optionLabels: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
};
