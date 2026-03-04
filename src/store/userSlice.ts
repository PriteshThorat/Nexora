import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  [key: string]: any;
}

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
    updateUserProfileField: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile!, ...action.payload };
      }
    },
  },
});

export const {
  setUserProfile,
  setLoading,
  setError,
  clearUserProfile,
  updateUserProfileField,
} = userSlice.actions;

export default userSlice.reducer;
