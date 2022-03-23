import {configureStore, ThunkAction, Action, combineReducers} from '@reduxjs/toolkit';
import { adminApi } from './services/admin';
import admin from './slices/admin';
import storageSession from 'redux-persist/lib/storage/session'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { enableMapSet } from 'immer';
import { baseApi } from './services/base';

enableMapSet()
const adminPersistConfig = {
  key: 'admin',
  storage: storageSession,
}

const reducers = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  admin: persistReducer(adminPersistConfig, admin),
})

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'product/setImages'],
        ignoredPaths: ['product.images'],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
