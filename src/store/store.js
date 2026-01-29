import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import themeReducer from './themeSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['theme'],
};

const persistedReducer = persistReducer(persistConfig, themeReducer);

export const store = configureStore({
    reducer: {
        theme: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);