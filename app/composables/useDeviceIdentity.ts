export function useDeviceIdentity() {
  const deviceId = useCookie<string>('parallax_device_id', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  if (import.meta.client) {
    const stored = localStorage.getItem('parallax_device_id')
    if (stored) {
      deviceId.value = stored
    } else if (!deviceId.value) {
      deviceId.value = crypto.randomUUID()
    }
    localStorage.setItem('parallax_device_id', deviceId.value!)
  }

  if (import.meta.server && !deviceId.value) {
    deviceId.value = crypto.randomUUID()
  }

  function getDisplayName(): string {
    if (import.meta.client) {
      return localStorage.getItem('parallax_display_name') || ''
    }
    return ''
  }

  function setDisplayName(name: string) {
    if (import.meta.client) {
      localStorage.setItem('parallax_display_name', name)
    }
  }

  function getFacilitatorToken(boardCode: string): string | null {
    if (import.meta.client) {
      return localStorage.getItem(`parallax_facilitator_${boardCode}`)
    }
    return null
  }

  function setFacilitatorToken(boardCode: string, token: string) {
    if (import.meta.client) {
      localStorage.setItem(`parallax_facilitator_${boardCode}`, token)
    }
  }

  function getRecentBoards(): Array<{ code: string; name: string; createdAt: string }> {
    if (import.meta.client) {
      try {
        return JSON.parse(localStorage.getItem('parallax_recent_boards') || '[]')
      } catch {
        return []
      }
    }
    return []
  }

  function addRecentBoard(code: string, name: string) {
    if (import.meta.client) {
      const boards = getRecentBoards().filter(b => b.code !== code)
      boards.unshift({ code, name, createdAt: new Date().toISOString() })
      localStorage.setItem('parallax_recent_boards', JSON.stringify(boards.slice(0, 20)))
    }
  }

  return {
    deviceId: computed(() => deviceId.value!),
    getDisplayName,
    setDisplayName,
    getFacilitatorToken,
    setFacilitatorToken,
    getRecentBoards,
    addRecentBoard,
  }
}
