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
import { useDiscussionsStore } from '../stores/DiscussionStore'
import axios from 'axios'

// Mock axios
vi.mock('axios')

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn().mockImplementation(key => {
    return 'fake-token'
  }),
  setItem: vi.fn(),
  clear: vi.fn()
}

// Setup localStorage mock before tests
vi.stubGlobal('localStorage', localStorageMock)

describe('DiscussionsStore', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and make it active
    setActivePinia(createPinia())
    // Reset axios and localStorage mocks
    vi.clearAllMocks()
    // Reset axios mocks with default successful response
    axios.get.mockResolvedValue({ data: [] })
    axios.post.mockResolvedValue({ data: { id: 1 } })
    axios.put.mockResolvedValue({ data: {} })
    axios.delete.mockResolvedValue({ data: {} })
  })

  describe('State', () => {
    it('should have empty initial state', () => {
      const store = useDiscussionsStore()
      expect(store.discussions).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('fetchDiscussions', () => {
    it('should fetch discussions successfully', async () => {
      // Mock API response
      const mockDiscussions = [
        { iddiscussion: 1, nomdiscussion: 'Discussion 1' },
        { iddiscussion: 2, nomdiscussion: 'Discussion 2' }
      ]
      axios.get.mockResolvedValueOnce({ data: mockDiscussions })

      const store = useDiscussionsStore()
      await store.fetchDiscussions()
      
      // Verify API was called correctly
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/discussions', {
        headers: { 'Authorization': 'Bearer fake-token' }
      })
      
      // Verify state was updated
      expect(store.discussions).toEqual(mockDiscussions)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when fetching discussions', async () => {
      // Mock API error
      const errorMessage = 'Network Error'
      axios.get.mockRejectedValueOnce({ message: errorMessage })

      const store = useDiscussionsStore()
      await store.fetchDiscussions()
      
      // Verify state reflects error
      expect(store.discussions).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })

    it('should handle API response error with message', async () => {
      // Mock API error with response data
      const errorMessage = 'Unauthorized'
      axios.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      })

      const store = useDiscussionsStore()
      await store.fetchDiscussions()
      
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('addDiscussion', () => {
    it('should add a discussion successfully', async () => {
      const mockDiscussions = [{ iddiscussion: 1, nomdiscussion: 'New Discussion' }]
      axios.get.mockResolvedValueOnce({ data: mockDiscussions })

      const store = useDiscussionsStore()
      await store.addDiscussion('New Discussion')

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3000/discussions',
        { nomdiscussion: 'New Discussion' },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
      // Vérifie que la liste a bien été rafraîchie
      expect(store.discussions).toEqual(mockDiscussions)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when adding a discussion', async () => {
      // Mock API error
      const errorMessage = 'Invalid data'
      axios.post.mockRejectedValueOnce({ message: errorMessage })

      const store = useDiscussionsStore()
      await store.addDiscussion('Invalid Discussion')
      
      // Verify error was handled
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('updateDiscussion', () => {
    it('should update a discussion successfully', async () => {
      // Mock fetchDiscussions to verify it's called
      const mockDiscussions = [{ iddiscussion: 1, nomdiscussion: 'Updated Discussion' }]
      axios.get.mockResolvedValueOnce({ data: mockDiscussions })

      const store = useDiscussionsStore()
      
      await store.updateDiscussion(1, 'Updated Discussion')
      
      // Verify API was called correctly
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/discussions/1', 
        { nomdiscussion: 'Updated Discussion' },
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
      
      // Verify fetchDiscussions was called to refresh list
      expect(store.discussions).toEqual(mockDiscussions)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when updating a discussion', async () => {
      // Mock API error
      const errorMessage = 'Discussion not found'
      axios.put.mockRejectedValueOnce({ message: errorMessage })

      const store = useDiscussionsStore()
      await store.updateDiscussion(999, 'Non-existent Discussion')
      
      // Verify error was handled
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('deleteDiscussion', () => {
    it('should delete a discussion successfully', async () => {
      // Mock fetchDiscussions to verify it's called
      const mockDiscussions = [] // Empty after deletion
      axios.get.mockResolvedValueOnce({ data: mockDiscussions })

      const store = useDiscussionsStore()
      
      await store.deleteDiscussion(1)
      
      // Verify API was called correctly
      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:3000/discussions/1',
        { headers: { 'Authorization': 'Bearer fake-token' } }
      )
      
      // Verify fetchDiscussions was called to refresh list
      expect(store.discussions).toEqual(mockDiscussions)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when deleting a discussion', async () => {
      // Mock API error
      const errorMessage = 'Permission denied'
      axios.delete.mockRejectedValueOnce({ message: errorMessage })

      const store = useDiscussionsStore()
      await store.deleteDiscussion(1)
      
      // Verify error was handled
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })
  })
})