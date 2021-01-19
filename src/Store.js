/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2020
 */
import Bugsnag from '@bugsnag/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { navigationMiddleware } from './navigation';
import reducers from './reducers';

const persistConfig = {
  keyPrefix: '',
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    'pages',
    'user',
    'prescription',
    'patient',
    'finalise',
    'form',
    'prescriber',
    'wizard',
    'payment',
    'insurance',
    'dashboard',
    'dispensary',
    'modules',
    'supplierCredit',
    'fridge',
    'breach',
    'rowDetail',
    'permission',
    'cashTransaction',
  ],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const bugsnagMiddleware = () => next => action => {
  const { type = 'No action type!' } = action;
  Bugsnag.leaveBreadcrumb(type);

  next(action);
};

const store = createStore(
  persistedReducer,
  {},
  applyMiddleware(thunk, navigationMiddleware, bugsnagMiddleware)
);

const persistedStore = persistStore(store);
persistedStore.purge();

export { store, persistedStore };
