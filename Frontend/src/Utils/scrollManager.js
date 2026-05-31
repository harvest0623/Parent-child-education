const SCROLL_STORAGE_KEY = 'app_scroll_positions'

const getStoredPositions = () => {
  try {
    const data = sessionStorage.getItem(SCROLL_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const setStoredPositions = (positions) => {
  try {
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions))
  } catch (e) {
    console.error('scroll position save failed:', e)
  }
}

export const saveScrollPosition = (path) => {
  const positions = getStoredPositions()
  positions[path] = window.scrollY
  setStoredPositions(positions)
}

export const getScrollPosition = (path) => {
  const positions = getStoredPositions()
  return positions[path] || 0
}

export const clearScrollPosition = (path) => {
  const positions = getStoredPositions()
  delete positions[path]
  setStoredPositions(positions)
}

export const restoreScrollPosition = (path) => {
  const position = getScrollPosition(path)
  if (position > 0) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: position, behavior: 'instant' })
      })
    })
  }
}

export const scrollToTop = () => {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
}
