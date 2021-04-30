import Landing from './landing'
import CreateWatchlist from './watchlist/create'
import SignUp from './Authentication/signup'
import LogIn from './Authentication/login'
import Watchlist from './watchlist'
import SubscriptionWatchlist from './watchlist/subscribed'
import About from './About'
import CreateGameRequest from './watchlist/request'
import RequestList from './watchlist/requestList'

const AUTH_ROUTE = 'Auth'
const ADMIN_ROUTE = 'Admin'
const NO_AUTH_ROUTE = 'NoAuth'

const routes = {
  permanent: [
    {
      path: 'home',
      label: 'Home',
      Renderer: Landing,
    },
    {
      path: 'About',
      label: 'About',
      Renderer: About,
    },
  ],
  free: [
    {
      path: 'signUp',
      label: 'Sign Up',
      Renderer: SignUp,
      type: NO_AUTH_ROUTE,
    },
    {
      path: 'logIn',
      label: 'Log In',
      Renderer: LogIn,
      type: NO_AUTH_ROUTE,
    },
  ],
  authed: [
    {
      path: 'watchlist',
      label: 'Games',
      Renderer: Watchlist,
      type: AUTH_ROUTE,
    },
    {
      path: 'subs',
      label: 'Subscriptions',
      Renderer: SubscriptionWatchlist,
      type: AUTH_ROUTE,
    },
    {
      path: 'request',
      label: 'Game Request',
      Renderer: CreateGameRequest,
      type: AUTH_ROUTE,
    },
  ],
  admin: [
    {
      path: 'create',
      label: 'Create Game',
      Renderer: CreateWatchlist,
      type: ADMIN_ROUTE,
    },
    {
      path: 'create',
      label: 'Request List',
      Renderer: RequestList,
      type: ADMIN_ROUTE,
    },
  ],
}

const getRoutes = (type) => {
  return routes[type]
}

export default getRoutes
