/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2021
 */

import { ToastAndroid } from 'react-native';
import { PermissionSelectors } from '../selectors/permission';
import { selectScannedSensors } from '../selectors/vaccine';
import { PermissionActions } from './PermissionActions';
import BleService from '../bluetooth/BleService';
import { syncStrings, vaccineStrings } from '../localization';
import { UIDatabase } from '../database';
import { SensorManager } from '../bluetooth/SensorManager';

export const VACCINE_ACTIONS = {
  BLINK: 'Vaccine/blinkSensor',
  BLINK_START: 'Vaccine/blinkSensorStart',
  BLINK_STOP: 'Vaccine/blinkSensorStop',
  SAVE_SENSOR_ERROR: 'Vaccine/saveSensorError',
  SAVE_SENSOR_START: 'Vaccine/saveSensorStart',
  SAVE_SENSOR_SUCCESS: 'Vaccine/saveSensorSuccess',
  SCAN_START: 'Vaccine/sensorScanStart',
  SCAN_STOP: 'Vaccine/sensorScanStop',
  SENSOR_FOUND: 'Vaccine/sensorFound',
  SET_LOG_INTERVAL_ERROR: 'Vaccine/setLogIntervalError',
  SET_LOG_INTERVAL_START: 'Vaccine/setLogIntervalStart',
  SET_LOG_INTERVAL_SUCCESS: 'Vaccine/setLogIntervalSuccess',
  TOGGLE_BUTTON_START: 'Vaccine/toggleButtonStart',
  TOGGLE_BUTTON_STOP: 'Vaccine/toggleButtonStop',
};

const blinkStart = macAddress => ({ type: VACCINE_ACTIONS.BLINK_START, payload: { macAddress } });
const blinkStop = () => ({ type: VACCINE_ACTIONS.BLINK_STOP });
const scanStart = () => ({ type: VACCINE_ACTIONS.SCAN_START });
const scanStop = () => ({ type: VACCINE_ACTIONS.SCAN_STOP });
const sensorFound = macAddress => ({ type: VACCINE_ACTIONS.SENSOR_FOUND, payload: { macAddress } });
const setLogIntervalStart = macAddress => ({
  type: VACCINE_ACTIONS.SET_LOG_INTERVAL_START,
  payload: { macAddress },
});
const setLogIntervalSuccess = () => ({ type: VACCINE_ACTIONS.SET_LOG_INTERVAL_SUCCESS });
const setLogIntervalError = () => ({ type: VACCINE_ACTIONS.SET_LOG_INTERVAL_ERROR });
const toggleButtonStart = macAddress => ({
  type: VACCINE_ACTIONS.TOGGLE_BUTTON_START,
  payload: { macAddress },
});
const toggleButtonStop = macAddress => ({
  type: VACCINE_ACTIONS.TOGGLE_BUTTON_STOP,
  payload: { macAddress },
});
// const saveSensorError = () => ({ type: VACCINE_ACTIONS.SAVE_SENSOR_ERROR });
const saveSensorStart = macAddress => ({
  type: VACCINE_ACTIONS.SAVE_SENSOR_START,
  payload: { macAddress },
});
// const saveSensorSuccess = () => ({ type: VACCINE_ACTIONS.SAVE_SENSOR_SUCCESS });

/**
 * Helper wrapper which will check permissions for
 * bluetooth & location services before calling the supplied function
 * @param {Func} dispatch
 * @param {Func} getState
 * @param {Func} func method to run if permissions are enabled
 */
const withPermissions = async (dispatch, getState, func) => {
  const state = getState();
  const bluetoothEnabled = PermissionSelectors.bluetooth(state);
  const locationPermission = PermissionSelectors.location(state);

  // Ensure the correct permissions before initiating a new sync process.
  if (!bluetoothEnabled) await dispatch(PermissionActions.requestBluetooth());
  if (!locationPermission) await dispatch(PermissionActions.requestLocation());

  if (!bluetoothEnabled) {
    ToastAndroid.show(syncStrings.bluetooth_disabled, ToastAndroid.LONG);
    return null;
  }

  if (!locationPermission) {
    ToastAndroid.show(syncStrings.location_permission, ToastAndroid.LONG);
    return null;
  }

  return func(dispatch, getState);
};

const blinkSensor = macAddress => async dispatch => {
  dispatch(blinkStart(macAddress));
  await BleService().blinkWithRetries(macAddress, 3);
  dispatch(blinkStop(macAddress));
};

const scanForSensors = (dispatch, getState) => {
  dispatch(scanStart());

  const deviceCallback = device => {
    const { id: macAddress } = device;

    if (macAddress) {
      const alreadyScanned = selectScannedSensors(getState());
      const alreadySaved = UIDatabase.get('Sensor', macAddress, 'macAddress');

      if (!alreadyScanned?.includes(macAddress) && !alreadySaved) {
        dispatch(sensorFound(macAddress));
      }
    }
  };

  // Scan will continue running until it is stopped...
  BleService().scanForSensors(deviceCallback);
};

const setLogInterval = (macAddress, interval) => async dispatch => {
  let ok = false;
  let error = `Sensor response was not equal to 'Interval: ${interval}s'`;

  dispatch(setLogIntervalStart(macAddress));

  try {
    const result = await BleService().updateLogIntervalWithRetries(macAddress, interval, 3, error);
    const regex = new RegExp(`Interval: ${interval}s`); // TODO: update with sensor specific response as needed
    ok = regex.test(result);
  } catch (e) {
    error = e;
    ok = false;
  }

  if (ok) {
    dispatch(setLogIntervalSuccess());
  } else {
    ToastAndroid.show(vaccineStrings.E_COMMAND_FAILED, ToastAndroid.LONG);
    dispatch(setLogIntervalError(error));
  }

  return ok;
};

const saveSensor = sensor => async dispatch => {
  dispatch(saveSensorStart(sensor.macAddress));
  await SensorManager().saveSensor(sensor);
};

const toggleSensorButton = macAddress => async dispatch => {
  dispatch(toggleButtonStart(macAddress));
  const result = await BleService().toggleButton(macAddress);
  dispatch(toggleButtonStop(macAddress));
  return result;
};

const startSensorBlink = macAddress => async (dispatch, getState) => {
  await withPermissions(dispatch, getState, blinkSensor(macAddress));
  return null;
};

const startSensorScan = () => async (dispatch, getState) => {
  withPermissions(dispatch, getState, scanForSensors);
  return null;
};

const stopSensorScan = () => dispatch => {
  dispatch(scanStop());
  BleService().stopScan();
};

const startSensorToggleButton = macAddress => async (dispatch, getState) => {
  const success = await withPermissions(dispatch, getState, toggleSensorButton(macAddress));
  return success;
};

const startSetLogInterval = ({ macAddress, interval = 300 }) => async (dispatch, getState) => {
  const success = withPermissions(dispatch, getState, setLogInterval(macAddress, interval));
  return success;
};

export const VaccineActions = {
  blinkSensor,
  saveSensor,
  startSensorBlink,
  startSensorScan,
  startSensorToggleButton,
  startSetLogInterval,
  stopSensorScan,
};
