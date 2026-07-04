import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    setUser(state, action) { state.user = action.payload },
    clearUser(state) { state.user = null },
  },
})

export const { setUser, clearUser } = slice.actions
export default slice.reducer
