import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage or default to false
const getInitialDarkMode = () => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        darkMode: getInitialDarkMode(),
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            // Update document class for Tailwind
            if (state.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
            // Update document class for Tailwind
            if (state.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
    },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
