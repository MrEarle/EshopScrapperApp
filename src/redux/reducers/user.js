import { createSlice } from '@reduxjs/toolkit'
import jwt_decode from 'jwt-decode'

const user = {
  token: null,
  email: null,
  isAdmin: false,
  refreshToken: null
}

const userReducer = createSlice({
  name: 'user',
  initialState: user,
  reducers: {
    setIsAdmin(state, { payload }) {
      state.isAdmin = !!payload
    },
    setToken(state, { payload }) {
      const { email } = jwt_decode(payload)
      state.token = payload
      state.email = email
    },
    setRefreshToken(state, { payload }) {
      state.refreshToken = payload
    },
    logout(state) {
      state.token = null
      state.email = null
      state.isAdmin = false
      state.refreshToken = null
    },
  },
})

export const userActions = userReducer.actions
export default userReducer.reducer
