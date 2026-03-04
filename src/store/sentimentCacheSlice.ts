import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const sentimentCacheSlice = createSlice({
    name: "sentimentCache",
    initialState: {
        cache: {} as Record<string, any>, // { [newsTitle]: { status, analysis, user_interests, cachedAt } }
    },
    reducers: {
        cacheSentiment(state, action: PayloadAction<{ key: string; data: any }>) {
            const { key, data } = action.payload;
            state.cache[key] = { ...data, cachedAt: Date.now() };
        },
        clearSentimentCache(state) {
            state.cache = {};
        },
    },
});

export const { cacheSentiment, clearSentimentCache } = sentimentCacheSlice.actions;
export default sentimentCacheSlice.reducer;