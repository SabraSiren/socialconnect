import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import PostService from '../../API/PostService'
import {getFriendlyErrorMessage} from "../../utils/errorHandler";

// Асинхронные экшены
export const getPosts = createAsyncThunk(
    'posts/getPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await PostService.getPosts()
            return response.posts
        } catch (error) {
            return rejectWithValue(getFriendlyErrorMessage(error))
        }
    }
)

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (content, { rejectWithValue }) => {
        try {
            return await PostService.createPost(content)
        } catch (error) {
            return rejectWithValue(getFriendlyErrorMessage(error))
        }
    }
)

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (postId, { rejectWithValue }) => {
        try {
            await PostService.deletePost(postId)
            return postId // возвращаем ID для удаления из состояния
        } catch (error) {
            return rejectWithValue(getFriendlyErrorMessage(error))
        }
    }
)

export const likePost = createAsyncThunk(
    'posts/likePost',
    async (postId, { rejectWithValue }) => {
        try {
            return await PostService.likePost(postId)
        } catch (error) {
            return rejectWithValue(getFriendlyErrorMessage(error))
        }
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        items: [],
        isLoading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        // Локальное обновление лайков (оптимистичное обновление)
        updatePost: (state, action) => {
            const updatedPost = action.payload
            const index = state.items.findIndex(post => post.id === updatedPost.id)
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...updatedPost }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // getPosts
            .addCase(getPosts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.items = action.payload
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            // createPost
            .addCase(createPost.fulfilled, (state, action) => {
                // Новый пост добавляется в начало списка
                state.items.unshift(action.payload)
            })
            // deletePost
            .addCase(deletePost.fulfilled, (state, action) => {
                // Удаляем пост по ID
                state.items = state.items.filter(post => post.id !== action.payload)
            })
            // likePost
            .addCase(likePost.fulfilled, (state, action) => {
                // Обновляем пост с новыми данными (лайки и т.д.)
                const updatedPost = action.payload
                const index = state.items.findIndex(post => post.id === updatedPost.id)
                if (index !== -1) {
                    state.items[index] = updatedPost
                }
            })
    }
})

export const { clearError, updatePost } = postsSlice.actions
export default postsSlice.reducer
