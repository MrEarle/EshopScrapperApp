import { createSlice } from '@reduxjs/toolkit'

const appStateReducer = createSlice({
  name: 'appState',
  initialState: {
    firstOpen: true,
    expoToken: null,
  },
  reducers: {
    setFirstOpen(state, { payload }) {
      state.firstOpen = payload
    },
    setExpoToken(state, { payload }) {
      state.expoToken = payload
    },
  },
})

export const appStateActions = appStateReducer.actions
export default appStateReducer.reducer
