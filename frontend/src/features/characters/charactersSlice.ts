import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Character } from '../../types/character'
import { characterService } from '../../services/characterService'

interface CharactersState {
  characters: Character[]
  loading: boolean
  error: string | null
  selectedCharacter: Character | null
}

const initialState: CharactersState = {
  characters: [],
  loading: false,
  error: null,
  selectedCharacter: null,
}

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async () => {
    return await characterService.getCharacters()
  }
)

export const fetchCharacterById = createAsyncThunk(
  'characters/fetchCharacterById',
  async (id: string) => {
    return await characterService.getCharacter(id)
  }
)

export const createCharacter = createAsyncThunk(
  'characters/createCharacter',
  async (characterData: Partial<Character>) => {
    return await characterService.createCharacter(characterData)
  }
)

export const updateCharacter = createAsyncThunk(
  'characters/updateCharacter',
  async ({ id, data }: { id: string; data: Partial<Character> }) => {
    return await characterService.updateCharacter(id, data)
  }
)

export const deleteCharacter = createAsyncThunk(
  'characters/deleteCharacter',
  async (id: string) => {
    await characterService.deleteCharacter(id)
    return id
  }
)

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedCharacter: (state, action: PayloadAction<Character | null>) => {
      state.selectedCharacter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch characters
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false
        state.characters = action.payload
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch characters'
      })
      // Fetch character by ID
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.selectedCharacter = action.payload
      })
      // Create character
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.characters.push(action.payload)
      })
      // Update character
      .addCase(updateCharacter.fulfilled, (state, action) => {
        const index = state.characters.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.characters[index] = action.payload
        }
        if (state.selectedCharacter?.id === action.payload.id) {
          state.selectedCharacter = action.payload
        }
      })
      // Delete character
      .addCase(deleteCharacter.fulfilled, (state, action) => {
        state.characters = state.characters.filter(c => c.id !== action.payload)
        if (state.selectedCharacter?.id === action.payload) {
          state.selectedCharacter = null
        }
      })
  },
})

export const { clearError, setSelectedCharacter } = charactersSlice.actions
export default charactersSlice.reducer