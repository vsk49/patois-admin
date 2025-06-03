/* 
 * These unit tests verify store logic in isolation using mocks, without database interaction.
 * This approach provides faster, more reliable tests that can simulate both success and error 
 * scenarios. We mock axios to prevent real HTTP requests and simulate API responses. While not 
 * testing actual database operations, these tests ensure correct request formatting, response 
 * handling, and state management. For complete coverage, separate integration tests with a real 
 * database would be needed, but these unit tests provide a solid foundation for development.
 */


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMotsStore } from '@/stores/MotsStore'
import axios from 'axios'

// Mock axios
vi.mock('axios')

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn().mockImplementation(() => 'fake-token'),
  setItem: vi.fn(),
  clear: vi.fn()
}
vi.stubGlobal('localStorage', localStorageMock)

describe('MotsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: [] })
    axios.post.mockResolvedValue({ data: { id: 1 } })
    axios.put.mockResolvedValue({ data: {} })
    axios.delete.mockResolvedValue({ data: {} })
  })

  describe('State', () => {
    it('should have empty initial state', () => {
      const store = useMotsStore()
      expect(store.mots).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
     })
    })
  
  describe('fetchMots', () => {
    it('should fetch mots successfully', async () => {
      const mockMots = [
        { idmot: 1, motfrancais: 'chat', motpatois: 'gat', cheminimage: '', cheminaudio: '' }
      ]
      axios.get.mockResolvedValueOnce({ data: mockMots })

      const store = useMotsStore()
      await store.fetchMots()

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/mots', {
        headers: { 'Authorization': 'Bearer fake-token' }
      })
      expect(store.mots).toEqual(mockMots)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when fetching mots', async () => {
      const errorMessage = 'Network Error'
      axios.get.mockRejectedValueOnce({ message: errorMessage })

      const store = useMotsStore()
      await store.fetchMots()

      expect(store.mots).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('addMot', () => {
    it('should add a mot successfully', async () => {
        const mockMots = [
        { idmot: 1, motfrancais: 'chien', motpatois: 'chen', cheminimage: '', cheminaudio: '' }
        ]
        axios.get.mockResolvedValueOnce({ data: mockMots })

        const store = useMotsStore()
        await store.addMot('chien', 'chen', '', '')

        expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/mots',
        { motfrancais: 'chien', motpatois: 'chen', cheminimage: '', cheminaudio: '' },
        { headers: { 'Authorization': 'Bearer fake-token' } }
        )
        expect(store.mots).toEqual(mockMots)
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
    })
    
    it('should handle errors when adding a mot', async () => {
        const errorMessage = 'Invalid data'
        axios.post.mockRejectedValueOnce({ message: errorMessage })

        const store = useMotsStore()
        await store.addMot('chien', 'chen', '', '')

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
    })
  })

  describe('updateMot', () => {
    it('should update a mot successfully', async () => {
        const mockMots = [
        { idmot: 1, motfrancais: 'chien', motpatois: 'chen', cheminimage: '', cheminaudio: '' }
        ]
        axios.get.mockResolvedValueOnce({ data: mockMots })

        const store = useMotsStore()
        await store.updateMot(1, 'chien', 'chen', '', '')

        expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/mots/1',
        { motfrancais: 'chien', motpatois: 'chen', cheminimage: '', cheminaudio: '' },
        { headers: { 'Authorization': 'Bearer fake-token' } }
        )
        expect(store.mots).toEqual(mockMots)
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
    })

    it('should handle errors when updating a mot', async () => {
        const errorMessage = 'Mot not found'
        axios.put.mockRejectedValueOnce({ message: errorMessage })

        const store = useMotsStore()
        await store.updateMot(999, 'chien', 'chen', '', '')

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
    })
  })

  describe('deleteMot', () => {
    it('should delete a mot successfully', async () => {
        const mockMots = []
        axios.get.mockResolvedValueOnce({ data: mockMots })

        const store = useMotsStore()
        await store.deleteMot(1)

        expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:3000/mots/1',
        { headers: { 'Authorization': 'Bearer fake-token' } }
        )
        expect(store.mots).toEqual(mockMots)
        expect(store.loading).toBe(false)
        expect(store.error).toBe(null)
    })

    it('should handle errors when deleting a mot', async () => {
        const errorMessage = 'Permission denied'
        axios.delete.mockRejectedValueOnce({ message: errorMessage })

        const store = useMotsStore()
        await store.deleteMot(1)

        expect(store.loading).toBe(false)
        expect(store.error).toBe(errorMessage)
    })
  })
// Additional and refactored tests for MotsStore.js to improve coverage and reduce duplication

describe('MotsStore formatting and edge cases', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: [] })
    axios.post.mockResolvedValue({ data: { id: 1 } })
    axios.put.mockResolvedValue({ data: {} })
    axios.delete.mockResolvedValue({ data: {} })
    store = useMotsStore()
  })

  const imageCases = [
    { input: '', expected: '' },
    { input: 'assets/rose.png', expected: 'assets/rose.png' },
    { input: 'rose', expected: 'assets/rose.png' },
    { input: 'assets/rose', expected: 'assets/rose.png' },
    { input: 'rose.png', expected: 'assets/rose.png' },
    { input: 'assets/rose.png.png', expected: 'assets/rose.png.png' },
    { input: 'assets/', expected: 'assets/.png' }
  ]

  const audioCases = [
    { input: '', expected: '' },
    { input: 'audio/song.mp3', expected: 'audio/song.mp3' },
    { input: 'song', expected: 'audio/song.mp3' },
    { input: 'audio/song', expected: 'audio/song.mp3' },
    { input: 'song.mp3', expected: 'audio/song.mp3' },
    { input: 'audio/song with space.mp3', expected: 'audio/song_with_space.mp3' },
    { input: 'audio/', expected: 'audio/.mp3' }
  ]

  it.each(imageCases)('addMot formats cheminimage: %j', async ({ input, expected }) => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.addMot('fleur', 'flor', input, '')
    expect(axios.post).toHaveBeenLastCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminimage: expected }),
      expect.any(Object)
    )
  })

  it.each(audioCases)('addMot formats cheminaudio: %j', async ({ input, expected }) => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.addMot('oiseau', 'auzel', '', input)
    expect(axios.post).toHaveBeenLastCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminaudio: expected }),
      expect.any(Object)
    )
  })

  it.each(imageCases)('updateMot formats cheminimage: %j', async ({ input, expected }) => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.updateMot(1, 'fleur', 'flor', input, '')
    expect(axios.put).toHaveBeenLastCalledWith(
      'http://localhost:3000/mots/1',
      expect.objectContaining({ cheminimage: expected }),
      expect.any(Object)
    )
  })

  it.each(audioCases)('updateMot formats cheminaudio: %j', async ({ input, expected }) => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.updateMot(1, 'oiseau', 'auzel', '', input)
    expect(axios.put).toHaveBeenLastCalledWith(
      'http://localhost:3000/mots/1',
      expect.objectContaining({ cheminaudio: expected }),
      expect.any(Object)
    )
  })

  it('should set loading and error correctly on fetchMots error', async () => {
    axios.get.mockRejectedValueOnce({ message: 'fail' })
    await store.fetchMots()
    expect(store.loading).toBe(false)
    expect(store.error).toBe('fail')
  })

  it('should set loading and error correctly on addMot error', async () => {
    axios.post.mockRejectedValueOnce({ message: 'fail' })
    await store.addMot('a', 'b', '', '')
    expect(store.loading).toBe(false)
    expect(store.error).toBe('fail')
  })

  it('should set loading and error correctly on updateMot error', async () => {
    axios.put.mockRejectedValueOnce({ message: 'fail' })
    await store.updateMot(1, 'a', 'b', '', '')
    expect(store.loading).toBe(false)
    expect(store.error).toBe('fail')
  })

  it('should set loading and error correctly on deleteMot error', async () => {
    axios.delete.mockRejectedValueOnce({ message: 'fail' })
    await store.deleteMot(1)
    expect(store.loading).toBe(false)
    expect(store.error).toBe('fail')
  })

  it('should reset error and set loading on each action', async () => {
    store.error = 'previous'
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.fetchMots()
    expect(store.error).toBe(null)
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.addMot('a', 'b', '', '')
    expect(store.error).toBe(null)
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.updateMot(1, 'a', 'b', '', '')
    expect(store.error).toBe(null)
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.deleteMot(1)
    expect(store.error).toBe(null)
  })

  it('should not fail if cheminimage or cheminaudio is undefined', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    await store.addMot('a', 'b', undefined, undefined)
    expect(axios.post).toHaveBeenLastCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminimage: '', cheminaudio: '' }),
      expect.any(Object)
    )
  })
})
})