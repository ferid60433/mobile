/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2020
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import globalStyles from '../globalStyles';

import { TemperatureSyncActions } from '../actions/TemperatureSyncActions';
import { selectTemperatureSyncStateMessage } from '../selectors/temperatureSync';
import { TemperatureSyncIcon } from './TemperatureSyncIcon';

const mapStateToProps = state => {
  const syncMessage = selectTemperatureSyncStateMessage(state);
  const { temperatureSync } = state;
  const { disabled, syncError } = temperatureSync;

  return { syncMessage, disabled, syncError };
};

const mapDispatchToProps = dispatch => {
  const onOpenModal = () => dispatch(TemperatureSyncActions.openModal());
  return { onOpenModal };
};

export const TemperatureSyncStateComponent = ({
  onOpenModal,
  syncMessage,
  disabled,
  syncError,
}) => (
  <TouchableOpacity onPress={onOpenModal} style={localStyles.container}>
    <Text style={globalStyles.navBarText}>{syncMessage}</Text>
    <TemperatureSyncIcon hasError={!!syncError} isDisabled={disabled} />
  </TouchableOpacity>
);

const localStyles = StyleSheet.create({
  container: {
    ...globalStyles.navBarRightContainer,
    marginRight: 20,
  },
});

TemperatureSyncStateComponent.propTypes = {
  syncMessage: PropTypes.string.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  syncError: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export const TemperatureSyncState = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemperatureSyncStateComponent);
