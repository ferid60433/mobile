/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import {
  Abbreviation,
  Address,
  Currency,
  IndicatorAttribute,
  IndicatorValue,
  InsurancePolicy,
  InsuranceProvider,
  Item,
  ItemBatch,
  ItemCategory,
  ItemDepartment,
  ItemDirection,
  ItemStoreJoin,
  Location,
  LocationMovement,
  LocationType,
  MasterList,
  MasterListItem,
  MasterListNameJoin,
  Message,
  Name,
  NameStoreJoin,
  NameTag,
  NameTagJoin,
  NumberSequence,
  NumberToReuse,
  Options,
  PaymentType,
  Period,
  PeriodSchedule,
  Prescriber,
  Preference,
  ProgramIndicator,
  Report,
  Requisition,
  RequisitionItem,
  Sensor,
  SensorLog,
  Setting,
  Stocktake,
  StocktakeBatch,
  StocktakeItem,
  SyncOut,
  TemperatureBreach,
  TemperatureBreachConfiguration,
  TemperatureLog,
  Transaction,
  TransactionBatch,
  TransactionCategory,
  TransactionItem,
  Unit,
  User,
  VaccineVialMonitorStatus,
  VaccineVialMonitorStatusLog,
} from './DataTypes';

Address.schema = {
  name: 'Address',
  primaryKey: 'id',
  properties: {
    id: 'string',
    line1: { type: 'string', optional: true },
    line2: { type: 'string', optional: true },
    line3: { type: 'string', optional: true },
    line4: { type: 'string', optional: true },
    zipCode: { type: 'string', optional: true },
  },
};

ItemCategory.schema = {
  name: 'ItemCategory',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: { type: 'string', default: 'placeholderName' },
    parentCategory: { type: 'ItemCategory', optional: true },
  },
};

ItemDepartment.schema = {
  name: 'ItemDepartment',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: { type: 'string', default: 'placeholderName' },
    parentDepartment: { type: 'ItemDepartment', optional: true },
  },
};

Report.schema = {
  name: 'Report',
  primaryKey: 'id',
  properties: {
    id: 'string',
    type: 'string',
    title: 'string',
    _data: 'string',
  },
};

Setting.schema = {
  name: 'Setting',
  primaryKey: 'key',
  properties: {
    key: 'string', // Includes the user's UUID if it is per-user.
    value: 'string',
    user: { type: 'User', optional: true },
  },
};

SyncOut.schema = {
  name: 'SyncOut',
  primaryKey: 'id',
  properties: {
    id: 'string',
    changeTime: 'int', // UNIX epoch format.
    changeType: 'string', // 'create', 'update', or 'delete'.
    recordType: 'string', // table name.
    recordId: 'string',
  },
};

TransactionCategory.schema = {
  name: 'TransactionCategory',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: { type: 'string', default: 'placeholderName' },
    code: { type: 'string', default: 'placeholderCode' },
    type: { type: 'string', default: 'placeholderType' },
    parentCategory: { type: 'TransactionCategory', optional: true },
  },
};

User.schema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    username: { type: 'string', default: 'placeholderUsername' },
    lastLogin: { type: 'date', optional: true },
    firstName: { type: 'string', optional: true },
    lastName: { type: 'string', optional: true },
    email: { type: 'string', optional: true },
    isAdmin: { type: 'bool', default: false },
    passwordHash: {
      type: 'string',
      default: '4ada0b60df8fe299b8a412bbc8c97d0cb204b80e5693608ab2fb09ecde6d252d',
    },
    salt: { type: 'string', optional: true },
  },
};

export const schema = {
  schema: [
    Abbreviation,
    Address,
    Currency,
    IndicatorAttribute,
    IndicatorValue,
    InsurancePolicy,
    InsuranceProvider,
    Item,
    ItemBatch,
    ItemCategory,
    ItemDepartment,
    ItemDirection,
    ItemStoreJoin,
    Location,
    LocationMovement,
    LocationType,
    MasterList,
    MasterListItem,
    MasterListNameJoin,
    Message,
    Name,
    NameStoreJoin,
    NameTag,
    NameTagJoin,
    NumberSequence,
    NumberToReuse,
    Options,
    PaymentType,
    Period,
    PeriodSchedule,
    Prescriber,
    Preference,
    ProgramIndicator,
    Report,
    Requisition,
    RequisitionItem,
    Sensor,
    SensorLog,
    Setting,
    Stocktake,
    StocktakeBatch,
    StocktakeItem,
    SyncOut,
    TemperatureBreach,
    TemperatureBreachConfiguration,
    TemperatureLog,
    Transaction,
    TransactionBatch,
    TransactionCategory,
    TransactionItem,
    Unit,
    User,
    VaccineVialMonitorStatus,
    VaccineVialMonitorStatusLog,
  ],
  schemaVersion: 18,
};

export default schema;
