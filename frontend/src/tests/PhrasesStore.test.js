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
import { usePhrasesStore } from '@/stores/PhrasesStore'
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

describe('PhrasesStore', () => {
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
      const store = usePhrasesStore()
      expect(store.phrases).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('fetchPhrases', () => {
    it('should fetch phrases successfully', async () => {
      const mockPhrases = [
        { idphrase: 1, phrasefrancais: 'Comment vas-tu?', phrasepatois: 'Couma ça va?', cheminaudio: '', iddiscussion: 1 }
      ]
      axios.get.mockResolvedValueOnce({ data: mockPhrases })

      const store = usePhrasesStore()
      await store.fetchPhrases()

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/phrases', {
        headers: { 'Authorization': 'Bearer fake-token' }
      })
      expect(store.phrases).toEqual(mockPhrases)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when fetching phrases', async () => {
      const errorMessage = 'Network Error'
      axios.get.mockRejectedValueOnce({ message: errorMessage })

      const store = usePhrasesStore()
      await store.fetchPhrases()

      expect(store.phrases).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('addPhrase', () => {
    it('should add a phrase successfully', async () => {
      const mockPhrases = [
        { idphrase: 1, phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: '', iddiscussion: 1 }
      ]
      axios.get.mockResolvedValueOnce({ data: mockPhrases })

      const store = usePhrasesStore()
      await store.addPhrase('Bonjour', 'Bonzour', '', 1)

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/phrases',
        { phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: '', iddiscussion: 1 },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
      expect(store.phrases).toEqual(mockPhrases)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should format audio path when adding a phrase', async () => {
      const store = usePhrasesStore()
      await store.addPhrase('Bonjour', 'Bonzour', 'greeting.mp3', 1)

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/phrases',
        { phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: 'audio/greeting.mp3', iddiscussion: 1 },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
    })

    it('should handle existing audio path format when adding a phrase', async () => {
      const store = usePhrasesStore()
      await store.addPhrase('Bonjour', 'Bonzour', 'audio/greeting.mp3', 1)

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/phrases',
        { phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: 'audio/greeting.mp3', iddiscussion: 1 },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
    })

    it('should replace spaces with underscores in audio path', async () => {
      const store = usePhrasesStore()
      await store.addPhrase('Bonjour', 'Bonzour', 'greeting file.mp3', 1)

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/phrases',
        { phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: 'audio/greeting_file.mp3', iddiscussion: 1 },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
    })

    it('should handle errors when adding a phrase', async () => {
      const errorMessage = 'Invalid data'
      axios.post.mockRejectedValueOnce({ message: errorMessage })

      const store = usePhrasesStore()
      await store.addPhrase('Bonjour', 'Bonzour', '', 1)

      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('updatePhrase', () => {
    it('should update a phrase successfully', async () => {
      const mockPhrases = [
        { idphrase: 1, phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: '', iddiscussion: 1 }
      ]
      axios.get.mockResolvedValueOnce({ data: mockPhrases })

      const store = usePhrasesStore()
      await store.updatePhrase(1, 'Bonjour', 'Bonzour', '', 1)

      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/phrases/1',
        { phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: '', iddiscussion: 1 },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
      expect(store.phrases).toEqual(mockPhrases)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should format audio path when updating a phrase', async () => {
      const store = usePhrasesStore()
      await store.updatePhrase(1, 'Bonjour', 'Bonzour', 'greeting.mp3', 1)

      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/phrases/1',
        { phrasefrancais: 'Bonjour', phrasepatois: 'Bonzour', cheminaudio: 'audio/greeting.mp3', iddiscussion: 1 },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
    })

    it('should handle errors when updating a phrase', async () => {
      const errorMessage = 'Phrase not found'
      axios.put.mockRejectedValueOnce({ message: errorMessage })

      const store = usePhrasesStore()
      await store.updatePhrase(999, 'Bonjour', 'Bonzour', '', 1)

      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('deletePhrase', () => {
    it('should delete a phrase successfully', async () => {
      const mockPhrases = []
      axios.get.mockResolvedValueOnce({ data: mockPhrases })

      const store = usePhrasesStore()
      await store.deletePhrase(1)

      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:3000/phrases/1',
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
      expect(store.phrases).toEqual(mockPhrases)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when deleting a phrase', async () => {
      const errorMessage = 'Permission denied'
      axios.delete.mockRejectedValueOnce({ message: errorMessage })

      const store = usePhrasesStore()
      await store.deletePhrase(1)

      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })
})