import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import AuthService from '../../API/AuthService'
import { getFriendlyErrorMessage } from '../../utils/errorHandler'

// Замена  аусконтексту.

// Асинхронные экшены
export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const user = await AuthService.getCurrentUser()
            if (user) {
                return user // Пользователь авторизован.
            } else {
                return rejectWithValue(null) // Пользователь не авторизован - без сообщения об ошибке.
            }
        } catch (error) {
            // Любая ошибка при проверке = не авторизован, но без дружелюбного сообщения.
            return rejectWithValue(null)
        }
    }
)

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await AuthService.login(credentials)
            return  data?.user || await AuthService.getCurrentUser()
        } catch (error) {
            return rejectWithValue(getFriendlyErrorMessage(error))
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const res = await AuthService.register(userData)
            return  res?.user || await AuthService.getCurrentUser()
        } catch (error) {
            return rejectWithValue(getFriendlyErrorMessage(error))
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuth: false,
        isLoading: true,
        error: null
    },
    reducers: {
        logout: (state) => {
            AuthService.logout()
            state.user = null
            state.isAuth = false
            state.error = null
            state.isLoading = false
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // checkAuth
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuth = true
                state.user = action.payload
                state.error = null
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false
                state.isAuth = false
                state.user = null
                state.error = null // специально null именно для checkAuth.
            })
            // login
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuth = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isAuth = false
                state.user = null
                state.error = action.payload
            })
            // register
            .addCase(register.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isAuth = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isAuth = false
                state.user = null
                state.error = action.payload
            })
    }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer