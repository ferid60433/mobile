/* eslint-disable no-unused-expressions */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { PageButton } from './PageButton';

import { FORM_INPUT_TYPES } from '../utilities/formInputConfigs';
import { FormTextInput } from './FormInputs/FormTextInput';
import { FormDateInput } from './FormInputs/FormDateInput';
import { FormToggle } from './FormInputs/FormToggle';
import { FormDropdown } from './FormInputs/FormDropdown';
import { FormSlider } from './FormInputs/FormSlider';

import globalStyles, { SUSSOL_ORANGE, WHITE } from '../globalStyles';
import { modalStrings, generalStrings } from '../localization';
import {
  selectForm,
  selectCanSaveForm,
  selectCompletedForm,
  selectIsConfirmFormOpen,
} from '../selectors/form';
import { FormActions } from '../actions/FormActions';

import { ModalContainer } from './modals';
import { ConfirmForm } from './modalChildren';

/**
 * Component which will manage and control a set of user inputs of a form.
 * The configuration for the inputs comes from `formInputConfigs.js` where
 * the configs are defined for common inputs to create a form semi-declaritively.
 *
 * Uses the `Form` object within redux state to help manage state.
 *
 * @param {func}  onCancel        Callback passed from a parent to control the cancel button.
 * @param {func}  onUpdateForm    Takes the field/value and updates state within redux.
 * @param {func}  onCancelPressed Resets the form state in redux and calls the onClose callback.
 * @param {bool}  canSaveForm     Indicator that all fields are valid and required fields are filled
 * @param {func}  completedForm   Object containing key:value pairs of valid inputs from the form.
 * @param {func}  initialiseForm  Dispatcher to initialise the redux state with the correct config.
 * @param {func}  onSave          Callback to invoke on saving the form, passing back completedForm.
 * @param {func}  confirmText     Text to display on save confirmation. If blank, no confirmation
 *                                form is shown before saving.
 * @param {bool}  isDisabled      Indicator whether this Form is disabled.
 * @param {Array} inputConfig     Configuration array of input config objects.
 *                                See { getFormInputConfig } from src/utilities/formInputConfigs.
 */
const FormControlComponent = ({
  // Form state
  form,
  completedForm,
  inputConfig,
  isDisabled,
  // Save button state
  canSaveForm,
  saveButtonText,
  // Confirm form state
  isConfirmFormOpen,
  confirmText,
  // Cancel button state
  showCancelButton,
  cancelButtonText,
  // Form callbacks
  onInitialiseForm,
  onUpdateForm,
  // Save button callbacks
  onSaveForm,
  // Cancel button callbacks
  onCancelForm,
}) => {
  const [refs, setRefs] = React.useState([]);

  React.useEffect(() => {
    onInitialiseForm();
    setRefs({ length: inputConfig.length });
  }, []);

  const nextFocus = (index, key) => value => {
    onUpdateForm(key, value);
    refs[index + 1]?.current?.focus?.();
  };

  const formInputs = () =>
    inputConfig.map(
      (
        {
          type,
          key,
          isRequired,
          validator,
          initialValue,
          label,
          invalidMessage,
          isEditable,
          ...rest
        },
        index
      ) => {
        refs[index] = React.useRef();
        switch (type) {
          case FORM_INPUT_TYPES.TEXT: {
            return (
              <FormTextInput
                ref={refs[index]}
                form={form}
                formKey={key}
                onSubmit={nextFocus(index, key)}
                key={key}
                value={initialValue}
                isRequired={isRequired}
                onValidate={validator}
                onChangeText={value => onUpdateForm(key, value)}
                label={label}
                invalidMessage={invalidMessage}
                isDisabled={!isEditable || isDisabled}
                autoFocus={index === 0}
              />
            );
          }
          case FORM_INPUT_TYPES.DATE: {
            return (
              <FormDateInput
                ref={refs[index]}
                key={key}
                isRequired={isRequired}
                label={label}
                value={initialValue}
                onChangeDate={value => onUpdateForm(key, value)}
                onValidate={validator}
                invalidMessage={invalidMessage}
                onSubmit={nextFocus(index, key)}
                isDisabled={isDisabled}
                autoFocus={index === 0}
              />
            );
          }
          case FORM_INPUT_TYPES.DROPDOWN: {
            const { options, optionKey } = rest;
            return (
              <FormDropdown
                key={key}
                isRequired={isRequired}
                label={label}
                value={completedForm?.[key] ?? initialValue}
                onValueChange={value => onUpdateForm(key, value)}
                options={options}
                optionKey={optionKey}
                isDisabled={!isEditable || isDisabled}
              />
            );
          }
          case FORM_INPUT_TYPES.TOGGLE: {
            const { options, optionLabels } = rest;
            return (
              <FormToggle
                options={options}
                optionLabels={optionLabels}
                value={completedForm?.[key] ?? initialValue}
                onValueChange={value => onUpdateForm(key, value)}
                key={key}
                label={label}
                isRequired={isRequired}
                isDisabled={!isEditable || isDisabled}
              />
            );
          }
          case FORM_INPUT_TYPES.SLIDER: {
            const { maximumValue, minimumValue, step } = rest;
            return (
              <FormSlider
                ref={refs[index]}
                maxmimumValue={maximumValue}
                minimumValue={minimumValue}
                step={step}
                value={completedForm?.[key] ?? initialValue}
                onValueChange={value => onUpdateForm(key, value)}
                key={key}
                label={label}
                isRequired={isRequired}
                isDisabled={isDisabled}
              />
            );
          }
          default:
            return null;
        }
      }
    );

  const SaveButton = React.useCallback(
    () => (
      <PageButton
        onPress={onSaveForm}
        style={localStyles.saveButton}
        isDisabled={!canSaveForm || isDisabled}
        textStyle={localStyles.saveButtonTextStyle}
        text={saveButtonText}
      />
    ),
    [isDisabled, showCancelButton, canSaveForm, saveButtonText, onSaveForm]
  );

  const CancelButton = React.useCallback(
    () =>
      showCancelButton ? (
        <PageButton
          onPress={onCancelForm}
          style={localStyles.cancelButton}
          textStyle={localStyles.cancelButtonTextStyle}
          text={cancelButtonText}
        />
      ) : null,
    [showCancelButton, cancelButtonText, onCancelForm]
  );

  const Buttons = React.useCallback(
    () => (
      <View style={localStyles.buttonsRow}>
        <SaveButton />
        <CancelButton />
      </View>
    ),
    [SaveButton, CancelButton]
  );

  return (
    <View style={localStyles.flexOne}>
      <ScrollView style={localStyles.whiteBackground}>
        <View style={localStyles.flexRow}>
          <View style={localStyles.flexOne} />
          <View style={localStyles.flexTen}>{formInputs()}</View>
          <View style={localStyles.flexOne} />
        </View>
      </ScrollView>
      <Buttons />
      <ModalContainer isVisible={isConfirmFormOpen} noCancel>
        <ConfirmForm
          isOpen={isConfirmFormOpen}
          questionText={confirmText}
          onConfirm={onSaveForm}
          onCancel={onCancelForm}
          confirmText={modalStrings.confirm}
        />
      </ModalContainer>
    </View>
  );
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { form, completedForm, canSaveForm, isConfirmFormOpen } = stateProps;
  const { initialiseForm, showConfirmForm, hideConfirmForm, updateForm, resetForm } = dispatchProps;
  const {
    inputConfig,
    isDisabled,
    confirmOnSave,
    confirmText,
    saveButtonText,
    onSave,
    showCancelButton,
    cancelButtonText,
    onCancel,
  } = ownProps;
  const onInitialiseForm = () => initialiseForm(inputConfig);
  const onUpdateForm = (key, value) => !isDisabled && updateForm(key, value);
  const onSaveForm = () =>
    confirmOnSave && !isConfirmFormOpen ? showConfirmForm() : onSave(completedForm);
  const onCancelForm = () =>
    confirmOnSave && isConfirmFormOpen ? hideConfirmForm() : onCancel() && resetForm();
  return {
    form,
    completedForm,
    inputConfig,
    isDisabled,
    canSaveForm,
    saveButtonText,
    isConfirmFormOpen,
    confirmText,
    showCancelButton,
    cancelButtonText,
    onInitialiseForm,
    onUpdateForm,
    onSaveForm,
    onCancelForm,
  };
};

const mapDispatchToProps = dispatch => {
  const initialiseForm = config => dispatch(FormActions.initialiseForm(config));
  const showConfirmForm = () => dispatch(FormActions.showConfirmForm());
  const hideConfirmForm = () => dispatch(FormActions.hideConfirmForm());
  const updateForm = (key, value) => dispatch(FormActions.updateForm(key, value));
  const resetForm = () => dispatch(FormActions.resetForm());
  return { initialiseForm, showConfirmForm, hideConfirmForm, updateForm, resetForm };
};

const mapStateToProps = state => {
  const form = selectForm(state);
  const completedForm = selectCompletedForm(state);
  const canSaveForm = selectCanSaveForm(state);
  const isConfirmFormOpen = selectIsConfirmFormOpen(state);
  return { form, canSaveForm, isConfirmFormOpen, completedForm };
};

FormControlComponent.defaultProps = {
  form: {},
  completedForm: {},
  isDisabled: false,
  saveButtonText: generalStrings.save,
  confirmText: modalStrings.confirm,
  showCancelButton: true,
  cancelButtonText: modalStrings.cancel,
};

FormControlComponent.propTypes = {
  form: PropTypes.object,
  completedForm: PropTypes.object,
  inputConfig: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
  canSaveForm: PropTypes.bool.isRequired,
  saveButtonText: PropTypes.string,
  isConfirmFormOpen: PropTypes.bool.isRequired,
  confirmText: PropTypes.string,
  showCancelButton: PropTypes.bool,
  cancelButtonText: PropTypes.string,
  onInitialiseForm: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  onSaveForm: PropTypes.func.isRequired,
  onCancelForm: PropTypes.func.isRequired,
};

export const FormControl = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(FormControlComponent);

const localStyles = StyleSheet.create({
  saveButton: {
    ...globalStyles.button,
    flex: 1,
    backgroundColor: SUSSOL_ORANGE,
    alignSelf: 'center',
  },
  saveButtonTextStyle: {
    ...globalStyles.buttonText,
    color: 'white',
    fontSize: 14,
  },
  cancelButton: {
    ...globalStyles.button,
    flex: 1,
    alignSelf: 'center',
  },
  cancelButtonTextStyle: {
    ...globalStyles.buttonText,
    color: SUSSOL_ORANGE,
    fontSize: 14,
  },
  flexOne: { flex: 1 },
  flexTen: { flex: 10 },
  flexRow: { flex: 1, flexDirection: 'row' },
  buttonsRow: { marginTop: 10, flexDirection: 'row-reverse' },
  whiteBackground: { backgroundColor: WHITE },
});
