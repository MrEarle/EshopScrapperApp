import Landing from './landing'
import CreateWatchlist from './watchlist/create'
import SignUp from './Authentication/signup'
import LogIn from './Authentication/login'
import Watchlist from './watchlist'
import SubscriptionWatchlist from './watchlist/subscribed'
import CreateGameRequest from './watchlist/request'
import RequestList from './watchlist/requestList'

export const AUTH_ROUTE = 'Auth'
export const ADMIN_ROUTE = 'Admin'
export const NO_AUTH_ROUTE = 'NoAuth'

const routes = {
  permanent: [
    {
      path: 'home',
      label: 'Home',
      Renderer: Landing,
      icon: 'home-outline'
    },
  ],
  free: [
    {
      path: 'signUp',
      label: 'Sign Up',
      Renderer: SignUp,
      type: NO_AUTH_ROUTE,
      icon: 'person-add-outline'
    },
    {
      path: 'logIn',
      label: 'Log In',
      Renderer: LogIn,
      type: NO_AUTH_ROUTE,
      icon: 'log-in-outline'
    },
  ],
  authed: [
    {
      path: 'watchlist',
      label: 'Games',
      Renderer: Watchlist,
      type: AUTH_ROUTE,
      icon: 'tv-outline'
    },
    {
      path: 'subs',
      label: 'Subscriptions',
      Renderer: SubscriptionWatchlist,
      type: AUTH_ROUTE,
      icon: 'heart-outline'
    },
    {
      path: 'request',
      label: 'Game Request',
      Renderer: CreateGameRequest,
      type: AUTH_ROUTE,
      icon: 'file-text-outline'
    },
  ],
  admin: [
    {
      path: 'create',
      label: 'Create Game',
      Renderer: CreateWatchlist,
      type: ADMIN_ROUTE,
      icon: 'plus-circle-outline'
    },
    {
      path: 'create',
      label: 'Request List',
      Renderer: RequestList,
      type: ADMIN_ROUTE,
      icon: 'list-outline'
    },
  ],
}

const getRoutes = (type) => {
  return routes[type]
}

export default getRoutes
