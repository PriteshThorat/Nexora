import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import themeReducer from './themeSlice.ts';
import userReducer from './userSlice.ts';
import sentimentCacheReducer from './sentimentCacheSlice.ts';
import aiAnalysisReducer from './aiAnalysisSlice.ts';

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

// Types for Redux
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;