import API from './api';
import {normalizePost, normalizePostsArray} from './normalizePost'

const PostService = () => {
    async function getPosts() {
        try {
            const res = await API.get('/articles');
            const postList = res?.data?.articles ?? [];
            const posts = normalizePostsArray(postList);
            return {posts}
        } catch (err) {
            const message = err?.response?.data?.message || err.message || 'Error loading posts';
            throw new Error(message);
        }
    }

    async function getPost(postId) {
        try {
            const res = await API.get(`/articles/${postId}`);
            return normalizePost(res?.data ?? {});
        } catch (err) {
            const message = err?.response?.data?.message || err.message || 'Error loading post';
            throw new Error(message);
        }
    }

    async function createPost(payload) {
        try {
            const res = await API.post('/articles', payload);
            return normalizePost(res?.data ?? {});
        } catch (err) {
            const message = err?.response?.data?.message || err.message || 'Error creating post';
            throw new Error(message);
        }
    }

    async function deletePost(postId) {
        try {
            const res = await API.delete(`/articles/${postId}`);
            return res?.data ?? null;
        } catch (err) {
            const message = err?.response?.data?.message || err.message || 'Error delete post';
            throw new Error(message);
        }
    }

    async function likePost(postId) {
        try {
            const res = await API.patch(`/articles/${postId}/like`)
            if (res?.data) {
                return normalizePost(res.data);
            }
            return null;
        } catch (err) {
            const message = err?.response?.data?.message || err.message || 'Error liking post';
            throw new Error(message);
        }
    }

    return {
        getPosts,
        getPost,
        createPost,
        deletePost,
        likePost,
    }
};

export default PostService();