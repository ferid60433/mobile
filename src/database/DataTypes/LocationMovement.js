/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2020
 */

import Realm from 'realm';

export class LocationMovement extends Realm.Object {
  get breaches() {
    return (
      this.location?.breaches?.filtered(
        '(startTimestamp <= $0 && (endTimestamp >= $0 || endTimestamp == null)) ||' +
          '(startTimestamp >= $0 && startTimestamp <= $1)',
        this.enterTimestamp,
        this.exitTimestamp ?? new Date()
      ) ?? []
    );
  }

  leaveLocation(database) {
    this.exitTimestamp = new Date();
    database.save('LocationMovement', this);
  }
}

LocationMovement.schema = {
  name: 'LocationMovement',
  primaryKey: 'id',
  properties: {
    id: 'string',
    location: { type: 'Location', optional: true },
    itemBatch: { type: 'ItemBatch', optional: true },
    enterTimestamp: { type: 'date', default: new Date() },
    exitTimestamp: { type: 'date', optional: true },
  },
};

export default LocationMovement;
