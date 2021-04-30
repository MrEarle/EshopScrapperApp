import api from '.'

export const getPaginatedFetch = (url) => async (page, pageSize, search) => {
  const offset = (page - 1) * pageSize
  const limit = offset + pageSize
  const { result } = await api.get(url, null, {
    offset,
    limit,
    search,
  })
  return result
}

export const validateEshopUrl = (url) => {
  const pattern = /^https:\/\/eshop-prices\.com\/games\/(\d+)-.+$/
  const match = pattern.exec(url)
  if (!match) return null
  return match && match[1]
}
