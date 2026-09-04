import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserRole } from '@/utils/rolePermissions'

interface AuthUser {
  id: string
  name: string
  role: UserRole
}

interface AuthState {
  user: AuthUser | null
}

const initialState: AuthState = { user: null }

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = slice.actions
export default slice.reducer