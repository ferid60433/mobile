/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2020
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { PageInfo } from './PageInfo/PageInfo';

import { getPageInfoColumns } from '../pages/dataTableUtilities';

import { DARKER_GREY, WHITE, SUSSOL_ORANGE } from '../globalStyles';

const CustomerRequisitionItemDetailsComponent = ({ item }) => (
  <View style={localStyles.container}>
    <PageInfo
      titleTextAlign="right"
      titleColor={SUSSOL_ORANGE}
      infoColor={WHITE}
      columns={getPageInfoColumns('customerRequisitionItemDetail')(item)}
      numberOfLines={2}
    />
  </View>
);

const localStyles = StyleSheet.create({
  container: {
    paddingLeft: 50,
    backgroundColor: DARKER_GREY,
    height: 250,
    marginLeft: 20,
    marginRight: 20,
  },
});

CustomerRequisitionItemDetailsComponent.propTypes = { item: PropTypes.object.isRequired };

export const CustomerRequisitionItemDetails = React.memo(CustomerRequisitionItemDetailsComponent);
