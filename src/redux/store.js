import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import userReducer from './reducers/user'
import appState from './reducers/appState'
import AsyncStorage from '@react-native-async-storage/async-storage'


const rootReducer = combineReducers({
  user: userReducer,
  appState: appState
})

const persistedStore = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    blacklist: []
  },
  rootReducer
)

const store = configureStore({
  reducer: persistedStore,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  })
})

export default store
