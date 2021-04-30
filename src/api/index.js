import { userActions } from '../redux/reducers/user'
import store from '../redux/store'
import { validateJwt } from './jwt'

class Api {
  /* Mediates the interaction with the API through HTTP requests */
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.baseHeaders = {
      'content-type': 'application/json',
    }
  }

  /** Obtains the access token from the store. If it's expired, tries to refresh. */
  async getAccessToken() {
    // Await for access token initialization
    const accessToken = store.getState().user.token
    if (!accessToken) return null

    // Verify expiration
    const validToken = validateJwt(accessToken)
    if (!validToken) {
      try {
        const { token } = await this.refresh()
        return token
      } catch (err) {
        store.dispatch(userActions.logout)
        return null
      }
    }
    return accessToken
  }

  /**
   * Returns required headers based on user authentications
   * @returns {object} Headers for HTTP request with access token if user is authenticated
   */
  async authedHeaders() {
    const accessToken = await this.getAccessToken()
    if (!accessToken) return this.baseHeaders
    return {
      ...this.baseHeaders,
      Authorization: `Bearer ${accessToken}`,
    }
  }

  /**
   * Get's the full HTTP URL from the API path
   * @param {string} path API path. (For http://localhost:8000/api/registry/plot, path='registry/plot')
   * @param {object=} query Optional. Query object to be included as a query string in the url.
   * @returns {string} url
   */
  url(path, query = {}) {
    const url = new URL(`${this.baseUrl}${path}`)
    Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, v))
    return url
  }

  /**
   * Executes an authenticated get/post/patch/delete request
   * @param {string} path API path. (For http://localhost:8000/api/registry/plot, path='registry/plot')
   * @param {Object} body Body object for HTTP request. Only on post/patch.
   * @param {Object} headers Extra headers to add to request.
   * @param {Object} query Query parameters for HTTP request.
   * @param {'GET'|'POST'|'PATCH'|'DELETE'} method HTTP request method.
   */
  async authFetch(path, body, headers, query, method) {
    if (path[path.length - 1] !== '/') {
      path = `${path}/`
    }
    const authedHeaders = await this.authedHeaders()
    return fetch(this.url(path, query), {
      method,
      headers: { ...authedHeaders, ...headers },
      ...(body && { body: JSON.stringify(body) }),
    })
  }

  /**
   * Execute a get request
   * @param {string} path API path.
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  async get(path, headers, query) {
    return this.authFetch(path, null, headers, query, 'GET').then((resp) =>
      resp.json()
    )
  }

  /**
   * Execute a post request
   * @param {string} path API path. Must end with '/' (E.g.: 'registry/plot/')
   * @param {Object} body Request body
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  post(path, body, headers, query) {
    return this.authFetch(path, body, headers, query, 'POST')
  }

  /**
   * Execute a patch request
   * @param {string} path API path. Must end with '/' (E.g.: 'registry/plot/')
   * @param {Object} body Request body
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  patch(path, body, headers, query) {
    return this.authFetch(path, body, headers, query, 'PATCH')
  }

  /**
   * Execute a delete request
   * @param {string} path API path.
   * @param {Object.<string>} headers Object containing extra headers
   * @param {Object} query Object containing query parameters
   */
  delete(path, headers, query) {
    return this.authFetch(path, null, headers, query, 'DELETE')
  }

  /**
   * Method for registering a new user
   * @param {{username: string, email: string, password: string, password2: string}} body Object containing the registration parameters
   * @returns {{token: string}}
   */
  async register(body) {
    if (body.password !== body.password2)
      throw new Error('Passwords must match!')
    const response = await fetch(this.url('user/signUp'), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify(body),
    }).then((resp) => resp.json())

    if (!response || !response.result || !response.result.token) {
      return { errors: response }
    }

    return response.result
  }

  /**
   * Method for loggingIn a new user
   * @param {{email: string, password: string}} body Object containing username and password
   * @returns {{token: string}}
   */
  async logIn(body) {
    const response = await fetch(this.url('user/auth'), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify(body),
    }).then((resp) => resp.json())

    if (!response || !response.result) {
      throw new Error('API error')
    }
    return response.result
  }

  async logout() {
    const refreshToken = store.getState().user.refreshToken
    if (refreshToken) {
      await fetch(this.url('user/logout'), {
        method: 'POST',
        headers: this.authedHeaders(),
        body: JSON.stringify({ token: refreshToken }),
      }).catch((err) => console.log(err))
    }

    store.dispatch(userActions.logout())
  }

  async refresh() {
    const refreshToken = store.getState().user.refreshToken

    if (!refreshToken) throw new Error('No refresh token')

    const response = await fetch(this.url('user/token'), {
      method: 'POST',
      headers: this.baseHeaders,
      body: JSON.stringify({ token: refreshToken }),
    }).then((res) => res.json())

    if (!response || !response.result) throw new Error('API Error')

    store.dispatch(userActions.setToken(response.result.token))

    return response.result
  }
}

// eslint-disable-next-line no-undef
const HTTP_API_URL = 'https://nameless-refuge-58589.herokuapp.com/'
const api = new Api(HTTP_API_URL)
export default api
