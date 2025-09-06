import { api } from './api'
import { Character } from '../types/character'

export const characterService = {
  async getCharacters(): Promise<Character[]> {
    const response = await api.get('/characters')
    return response.data
  },

  async getCharacter(id: string): Promise<Character> {
    const response = await api.get(`/characters/${id}`)
    return response.data
  },

  async createCharacter(character: Partial<Character>): Promise<Character> {
    const response = await api.post('/characters', character)
    return response.data
  },

  async updateCharacter(id: string, character: Partial<Character>): Promise<Character> {
    const response = await api.put(`/characters/${id}`, character)
    return response.data
  },

  async deleteCharacter(id: string): Promise<void> {
    await api.delete(`/characters/${id}`)
  },
}