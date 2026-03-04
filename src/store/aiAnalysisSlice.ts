import { createSlice } from '@reduxjs/toolkit';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

interface AIAnalysisState {
    stockPredictions: Record<string, CacheEntry<any>>;
    sentimentAnalysis: Record<string, CacheEntry<any>>;
    newsSentiment: Record<string, CacheEntry<any>>;
    cacheExpiry: number;
}

const initialState: AIAnalysisState = {
    stockPredictions: {}, // { ticker: { data, timestamp } }
    sentimentAnalysis: {}, // { headlineHash: { data, timestamp } }
    newsSentiment: {}, // { ticker: { data, timestamp } }
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds (prevent excessive Gemini API calls)
};

const aiAnalysisSlice = createSlice({
    name: 'aiAnalysis',
    initialState,
    reducers: {
        // Store stock prediction in cache
        setCachedPrediction: (state, action) => {
            const { ticker, data } = action.payload;
            state.stockPredictions[ticker] = {
                data,
                timestamp: Date.now(),
            };
        },

        // Get cached stock prediction
        getCachedPrediction: (state, action) => {
            const ticker = action.payload;
            const cached = state.stockPredictions[ticker];
            if (cached && Date.now() - cached.timestamp < state.cacheExpiry) {
                return cached.data;
            }
            return null;
        },

        // Store sentiment analysis in cache
        setCachedSentimentAnalysis: (state, action) => {
            const { headlineHash, data } = action.payload;
            state.sentimentAnalysis[headlineHash] = {
                data,
                timestamp: Date.now(),
            };
        },

        // Get cached sentiment analysis
        getCachedSentimentAnalysis: (state, action) => {
            const headlineHash = action.payload;
            const cached = state.sentimentAnalysis[headlineHash];
            if (cached && Date.now() - cached.timestamp < state.cacheExpiry) {
                return cached.data;
            }
            return null;
        },

        // Clear specific stock prediction cache
        clearPredictionCache: (state, action) => {
            const ticker = action.payload;
            delete state.stockPredictions[ticker];
        },

        // Clear specific sentiment analysis cache
        clearSentimentCache: (state, action) => {
            const headlineHash = action.payload;
            delete state.sentimentAnalysis[headlineHash];
        },

        // Store news sentiment in cache
        setCachedNewsSentiment: (state, action) => {
            const { ticker, data } = action.payload;
            // Initialize newsSentiment object if undefined (before rehydration)
            if (!state.newsSentiment) {
                state.newsSentiment = {};
            }
            state.newsSentiment[ticker] = {
                data,
                timestamp: Date.now(),
            };
        },

        // Clear specific news sentiment cache
        clearNewsSentimentCache: (state, action) => {
            const ticker = action.payload;
            if (state.newsSentiment) {
                delete state.newsSentiment[ticker];
            }
        },

        // Clear all AI analysis cache
        clearAllAICache: (state) => {
            state.stockPredictions = {};
            state.sentimentAnalysis = {};
            state.newsSentiment = {};
        },

        // Update cache expiry time
        setCacheExpiry: (state, action) => {
            state.cacheExpiry = action.payload;
        },
    },
    selectors: {
        // Selector to get cached prediction if valid
        selectCachedPrediction: (state, ticker) => {
            const cached = state.stockPredictions[ticker];
            if (cached && Date.now() - cached.timestamp < state.cacheExpiry) {
                return cached.data;
            }
            return null;
        },

        // Selector to get cached sentiment analysis if valid
        selectCachedSentimentAnalysis: (state, headlineHash) => {
            const cached = state.sentimentAnalysis[headlineHash];
            if (cached && Date.now() - cached.timestamp < state.cacheExpiry) {
                return cached.data;
            }
            return null;
        },

        // Get all cached predictions
        selectAllCachedPredictions: (state) => state.stockPredictions,

        // Get all cached sentiment analysis
        selectAllCachedSentimentAnalysis: (state) => state.sentimentAnalysis,

        // Selector to get cached news sentiment if valid
        selectCachedNewsSentiment: (state, ticker) => {
            if (!state.newsSentiment) {
                return null;
            }
            const cached = state.newsSentiment[ticker];
            if (cached && Date.now() - cached.timestamp < state.cacheExpiry) {
                return cached.data;
            }
            return null;
        },

        // Get cache stats
        selectCacheStats: (state) => ({
            predictionCount: Object.keys(state.stockPredictions).length,
            sentimentCount: Object.keys(state.sentimentAnalysis).length,
            newsCount: state.newsSentiment ? Object.keys(state.newsSentiment).length : 0,
            cacheExpiry: state.cacheExpiry,
        }),
    },
});

export const {
    setCachedPrediction,
    getCachedPrediction,
    setCachedSentimentAnalysis,
    getCachedSentimentAnalysis,
    clearPredictionCache,
    clearSentimentCache,
    setCachedNewsSentiment,
    clearNewsSentimentCache,
    clearAllAICache,
    setCacheExpiry,
} = aiAnalysisSlice.actions;

export const {
    selectCachedPrediction,
    selectCachedSentimentAnalysis,
    selectAllCachedPredictions,
    selectAllCachedSentimentAnalysis,
    selectCachedNewsSentiment,
    selectCacheStats,
} = aiAnalysisSlice.selectors;

export default aiAnalysisSlice.reducer;
