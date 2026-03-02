import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import userReducer from './userSlice';
import sentimentCacheReducer from './sentimentCacheSlice';
import aiAnalysisReducer from './aiAnalysisSlice';

const rootReducer = combineReducers({
    theme: themeReducer,
    user: userReducer,
    sentimentCache: sentimentCacheReducer,
    aiAnalysis: aiAnalysisReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['theme', 'user'], // Excluded aiAnalysis & sentimentCache (temporary cache data)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                warnAfter: 128, // Increased from default 32ms for dev
            },
            immutableCheck: {
                warnAfter: 128, // Increased from default 32ms for dev
            },
        }),
});

export const persistor = persistStore(store);