/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import { batch } from 'react-redux';

import { createRecord, UIDatabase } from '../database';
import { DispensaryActions } from './DispensaryActions';

export const PATIENT_ACTIONS = {
  PATIENT_EDIT: 'Patient/patientEdit',
  PATIENT_CREATION: 'Patient/patientCreation',
  VIEW_HISTORY: 'Patient/viewHistory',
  CLOSE_HISTORY: 'Patient/closeHistory',
  SORT_HISTORY: 'Patient/sortHistory',
  COMPLETE: 'Patient/complete',
};

const closeModal = () => ({ type: PATIENT_ACTIONS.COMPLETE });
const createPatient = () => ({ type: PATIENT_ACTIONS.PATIENT_CREATION });

const editPatient = patient => ({
  type: PATIENT_ACTIONS.PATIENT_EDIT,
  payload: {
    patient,
  },
});

const patientUpdate = patientDetails => (dispatch, getState) => {
  const { patient } = getState();
  const { currentPatient } = patient;

  const {
    id: currentPatientId,
    code: currentCode,
    name: currentName,
    firstName: currentFirstName,
    lastName: currentLastName,
    dateOfBirth: currentDateOfBirth,
    emailAddress: currentEmailAddress,
    phoneNumber: currentPhoneNumber,
    billingAddress: currentBillingAddress,
    country: currentCountry,
    supplyingStoreId: currentSupplyingStoreId,
    isActive: currentIsActive,
    female: currentFemale,
  } = currentPatient ?? {};

  const {
    id: currentBillAddressId,
    line1: currentLine1,
    line2: currentLine2,
    line3: currentLine3,
    line4: currentLine4,
    zipCode: currentZipCode,
  } = currentBillingAddress ?? {};

  const {
    id: patientId,
    code: patientCode,
    firstName: patientFirstName,
    lastName: patientLastName,
    dateOfBirth: patientDateOfBirth,
    emailAddress: patientEmailAddress,
    phoneNumber: patientPhoneNumber,
    addressOne: patientLine1,
    addressTwo: patientLine2,
    country: patientCountry,
    supplyingStoreId: patientSupplyingStoreId,
    female: patientFemale,
  } = patientDetails ?? {};

  const id = patientId ?? currentPatientId;
  const code = patientCode ?? currentCode;
  const firstName = patientFirstName ?? currentFirstName;
  const lastName = patientLastName ?? currentLastName;
  const name = `${lastName}, ${firstName}` || currentName;
  const dateOfBirth = patientDateOfBirth ?? currentDateOfBirth;
  const emailAddress = patientEmailAddress ?? currentEmailAddress;
  const phoneNumber = patientPhoneNumber ?? currentPhoneNumber;
  const billAddressId = currentBillAddressId;
  const billAddress1 = patientLine1 ?? currentLine1;
  const billAddress2 = patientLine2 ?? currentLine2;
  const billAddress3 = currentLine3;
  const billAddress4 = currentLine4;
  const billPostalZipCode = currentZipCode;
  const country = patientCountry ?? currentCountry;
  const female = patientFemale ?? currentFemale;
  const supplyingStoreId = patientSupplyingStoreId ?? currentSupplyingStoreId;
  const isActive = currentIsActive;

  const patientRecord = {
    id,
    code,
    firstName,
    lastName,
    name,
    dateOfBirth,
    emailAddress,
    phoneNumber,
    billAddressId,
    billAddress1,
    billAddress2,
    billAddress3,
    billAddress4,
    billPostalZipCode,
    country,
    female,
    supplyingStoreId,
    isActive,
  };

  UIDatabase.write(() => createRecord(UIDatabase, 'Patient', patientRecord));

  batch(() => {
    dispatch(closeModal());
    dispatch(DispensaryActions.closeLookupModal());
    dispatch(DispensaryActions.refresh());
  });
};

const sortPatientHistory = sortKey => ({
  type: PATIENT_ACTIONS.SORT_HISTORY,
  payload: { sortKey },
});

const viewPatientHistory = patient => ({
  type: PATIENT_ACTIONS.VIEW_HISTORY,
  payload: { patient },
});

const closePatientHistory = () => ({ type: PATIENT_ACTIONS.CLOSE_HISTORY });

export const PatientActions = {
  createPatient,
  patientUpdate,
  editPatient,
  closeModal,
  sortPatientHistory,
  viewPatientHistory,
  closePatientHistory,
};
