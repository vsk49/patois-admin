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
describe('formatImagePath and formatAudioPath (indirectly via addMot/updateMot)', () => {
  it('should format cheminimage correctly in addMot', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    const store = useMotsStore()

    // Already formatted
    await store.addMot('fleur', 'flor', 'assets/rose.png', '')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminimage: 'assets/rose.png' }),
      expect.any(Object)
    )

    // Needs formatting (no assets/, no .png)
    await store.addMot('fleur', 'flor', 'rose', '')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminimage: 'assets/rose.png' }),
      expect.any(Object)
    )

    // Already has assets/, missing .png
    await store.addMot('fleur', 'flor', 'assets/rose', '')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminimage: 'assets/rose.png' }),
      expect.any(Object)
    )

    // Already has .png, missing assets/
    await store.addMot('fleur', 'flor', 'rose.png', '')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminimage: 'assets/rose.png' }),
      expect.any(Object)
    )
  })

  it('should format cheminaudio correctly in addMot', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    const store = useMotsStore()

    // Already formatted
    await store.addMot('oiseau', 'auzel', '', 'audio/song.mp3')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminaudio: 'audio/song.mp3' }),
      expect.any(Object)
    )

    // Needs formatting (no audio/, no .mp3)
    await store.addMot('oiseau', 'auzel', '', 'song')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminaudio: 'audio/song.mp3' }),
      expect.any(Object)
    )

    // Already has audio/, missing .mp3
    await store.addMot('oiseau', 'auzel', '', 'audio/song')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminaudio: 'audio/song.mp3' }),
      expect.any(Object)
    )

    // Already has .mp3, missing audio/
    await store.addMot('oiseau', 'auzel', '', 'song.mp3')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminaudio: 'audio/song.mp3' }),
      expect.any(Object)
    )

    // Spaces in filename
    await store.addMot('oiseau', 'auzel', '', 'audio/song with space.mp3')
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/mots',
      expect.objectContaining({ cheminaudio: 'audio/song_with_space.mp3' }),
      expect.any(Object)
    )
  })

  it('should format cheminimage and cheminaudio correctly in updateMot', async () => {
    axios.get.mockResolvedValueOnce({ data: [] })
    const store = useMotsStore()

    await store.updateMot(1, 'fleur', 'flor', 'rose', 'song')
    expect(axios.put).toHaveBeenCalledWith(
      'http://localhost:3000/mots/1',
      expect.objectContaining({ cheminimage: 'assets/rose.png', cheminaudio: 'audio/song.mp3' }),
      expect.any(Object)
    )
  })
})
})