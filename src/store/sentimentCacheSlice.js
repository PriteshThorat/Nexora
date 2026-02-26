import { createSlice } from "@reduxjs/toolkit";

const sentimentCacheSlice = createSlice({
    name: "sentimentCache",
    initialState: {
        cache: {}, // { [newsTitle]: { status, analysis, user_interests, cachedAt } }
    },
    reducers: {
        cacheSentiment(state, action) {
            const { key, data } = action.payload;
            state.cache[key] = { ...data, cachedAt: Date.now() };
        },
        clearSentimentCache(state) {
            state.cache = {};
        },
    },
});

export const { cacheSentiment, clearSentimentCache } =
    sentimentCacheSlice.actions;
export default sentimentCacheSlice.reducer;
