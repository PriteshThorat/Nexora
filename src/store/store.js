import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import userReducer from './userSlice';
import sentimentCacheReducer from './sentimentCacheSlice';

const rootReducer = combineReducers({
    theme: themeReducer,
    user: userReducer,
    sentimentCache: sentimentCacheReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['theme', 'user', 'sentimentCache'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);