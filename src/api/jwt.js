import jwt_decode from 'jwt-decode'

export const validateJwt = (token) => {
  const decoded = jwt_decode(token)
  return Date.now() < decoded.exp * 1000
}
