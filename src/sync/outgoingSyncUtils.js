import {
  INTERNAL_TO_EXTERNAL,
  RECORD_TYPES,
  REQUISITION_TYPES,
  STATUSES,
  SYNC_TYPES,
  TRANSACTION_LINE_TYPES,
  TRANSACTION_TYPES,
} from './syncTranslators';

import { SETTINGS_KEYS } from '../settings';
const {
  SUPPLYING_STORE_ID,
  THIS_STORE_ID,
  THIS_STORE_NAME_ID,
} = SETTINGS_KEYS;

/**
 * Returns a json object fulfilling the requirements of the mSupply primary sync
 * server, based on a given syncOutRecord
 * @param  {Realm}        database      The local database
 * @param  {Settings}     settings      Access to local settings
 * @param  {Realm.object} syncOutRecord The sync out record to be translated
 * @return {object}                     The generated json object, ready to sync
 */
export function generateSyncJson(database, settings, syncOutRecord) {
  if (!syncOutRecord || !syncOutRecord.isValid()) throw new Error('Missing sync out record');
  if (!syncOutRecord.recordType || !syncOutRecord.id || !syncOutRecord.recordId) {
    throw new Error('Malformed sync out record');
  }
  const recordType = syncOutRecord.recordType;
  const recordId = syncOutRecord.recordId;

  let syncData;
  if (syncOutRecord.changeType === 'delete') {
    // If record has been deleted, just sync up the ID
    syncData = { ID: recordId };
  } else {
    // Get the record the syncOutRecord refers to from the database
    const recordResults = database.objects(recordType).filtered('id == $0', recordId);
    if (!recordResults || recordResults.length === 0) { // No such record
      throw new Error(`${recordType} with id = ${recordId} missing`);
    } else if (recordResults.length > 1) { // Duplicate records
      throw new Error(`Multiple ${recordType} records with id = ${recordId}`);
    }
    const record = recordResults[0];

    // Generate the appropriate data for the sync object to carry, representing the
    // record in its upstream form
    syncData = generateSyncData(settings, recordType, record);
  }

  // Create the JSON object to sync
  const syncJson = {
    SyncID: syncOutRecord.id,
    RecordType: RECORD_TYPES.translate(recordType, INTERNAL_TO_EXTERNAL),
    RecordID: recordId,
    SyncType: SYNC_TYPES.translate(syncOutRecord.changeType, INTERNAL_TO_EXTERNAL),
    StoreID: settings.get(THIS_STORE_ID),
    Data: syncData,
  };
  return syncJson;
}

/**
 * Turn an internal database object into data representing a record in the
 * mSupply primary server, ready for sync
 * @param  {Settings}     settings   Access to local settings
 * @param  {string}       recordType Internal type of record being synced
 * @param  {Realm.object} record     The record being synced
 * @return {object}                  The data to sync (in the form of upstream record)
 */
function generateSyncData(settings, recordType, record) {
  switch (recordType) {
    case 'ItemLine': {
      return {
        ID: record.id,
        store_ID: settings.get(THIS_STORE_ID),
        item_ID: record.item.id,
        pack_size: String(record.packSize),
        expiry_date: getDateString(record.expiryDate),
        batch: record.batch,
        available: String(record.numberOfPacks),
        quantity: String(record.numberOfPacks),
        stock_on_hand_tot: String(record.totalQuantity),
        cost_price: String(record.costPrice),
        sell_price: String(record.sellPrice),
        total_cost: String(record.costPrice * record.numberOfPacks),
        name_ID: settings.get(SUPPLYING_STORE_ID),
      };
    }
    case 'Requisition': {
      return {
        ID: record.id,
        date_entered: getDateString(record.entryDate),
        user_ID: record.user.id,
        name_ID: settings.get(THIS_STORE_NAME_ID),
        status: STATUSES.translate(record.status, INTERNAL_TO_EXTERNAL),
        daysToSupply: String(record.daysToSupply),
        store_ID: settings.get(SUPPLYING_STORE_ID),
        serial_number: record.serialNumber,
        type: REQUISITION_TYPES.translate(record.type, INTERNAL_TO_EXTERNAL),
      };
    }
    case 'RequisitionLine': {
      return {
        ID: record.id,
        requisition_ID: record.requisition.id,
        item_ID: record.item.id,
        stock_on_hand: String(record.stockOnHand),
        actualQuan: String(record.requiredQuantity),
        imprest_or_prev_quantity: String(record.imprestQuantity),
        line_number: String(record.sortIndex),
        Cust_stock_order: String(record.suggestedQuantity),
        comment: record.comment,
      };
    }
    case 'Stocktake': {
      return {
        ID: record.id,
        stock_take_date: getDateString(record.stocktakeDate),
        stock_take_time: getTimeString(record.stocktakeDate),
        created_by_ID: record.createdBy && record.createdBy.id,
        status: STATUSES.translate(record.status, INTERNAL_TO_EXTERNAL),
        finalised_by_ID: record.finalisedBy && record.finalisedBy.id,
        invad_additions_ID: record.additions && record.additions.id,
        invad_reductions_ID: record.subtractions && record.subtractions.id,
        store_ID: settings.get(THIS_STORE_ID),
        comment: record.comment,
        stock_take_created_date: getDateString(record.createdDate),
        serial_number: record.serialNumber,
      };
    }
    case 'StocktakeLine': {
      const itemLine = record.itemLine;
      return {
        ID: record.id,
        stock_take_ID: record.Stocktake.id,
        item_line_ID: itemLine.id,
        snapshot_qty: String(record.snapshotNumberOfPacks),
        snapshot_packsize: String(record.packSize),
        stock_take_qty: String(record.countedNumberOfPacks),
        line_number: String(record.sortIndex),
        expiry: getDateString(itemLine.expiryDate),
        cost_price: String(itemLine.costPrice),
        sell_price: String(itemLine.sellPrice),
        Batch: itemLine.batch,
        item_ID: itemLine.item.id,
      };
    }
    case 'Transaction': {
      return {
        ID: record.id,
        name_ID: record.otherParty && record.otherParty.id,
        invoice_num: record.serialNumber,
        comment: record.comment,
        entry_date: getDateString(record.entryDate),
        type: TRANSACTION_TYPES.translate(record.type, INTERNAL_TO_EXTERNAL),
        status: STATUSES.translate(record.status, INTERNAL_TO_EXTERNAL),
        total: String(record.totalPrice),
        their_ref: record.theirRef,
        confirm_date: getDateString(record.confirmDate),
        subtotal: String(record.totalPrice),
        user_ID: record.enteredBy && record.enteredBy.id,
        category_ID: record.category && record.category.id,
        confirm_time: getTimeString(record.confirmDate),
        store_ID: settings.get(THIS_STORE_ID),
      };
    }
    case 'TransactionLine': {
      const itemLine = record.itemLine;
      const transaction = record.transaction;
      return {
        ID: record.id,
        transaction_ID: record.transaction.id,
        item_ID: record.itemId,
        batch: record.batch,
        price_extension: String(record.totalPrice),
        note: record.note,
        cost_price: String(record.costPrice),
        sell_price: String(record.sellPrice),
        expiry_date: getDateString(record.expiryDate),
        pack_size: String(record.packSize),
        quantity: String(record.numberOfPacks),
        item_line_ID: itemLine.id,
        line_number: String(record.sortIndex),
        item_name: record.itemName,
        is_from_inventory_adjustment: transaction.otherParty &&
                                      transaction.otherParty.type === 'inventory_adjustment',
        type: TRANSACTION_LINE_TYPES.translate(record, INTERNAL_TO_EXTERNAL),
      };
    }
    default:
      throw new Error('Sync out record type not supported.');
  }
}

function getDateString(date) {
  if (!date || typeof date !== 'object') return '0000-00-00T00:00:00';
  return date.toISOString();
}

function getTimeString(date) {
  if (!date || typeof date !== 'object') return '00:00:00';
  return date.toTimeString().substring(0, 8);
}