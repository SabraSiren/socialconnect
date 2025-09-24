// Утилиты для работы с постами в LocalStorage

const STORAGE_KEY = 'user_posts';

// Получить все сохраненные посты
export const getSavedPosts = () => {
    try {
        const savedPosts = localStorage.getItem(STORAGE_KEY);
        return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (error) {
        console.error('Error loading posts from localStorage:', error);
        return [];
    }
};

// Сохранить пост
export const savePost = (post) => {
    try {
        const savedPosts = getSavedPosts();
        const newPost = {
            ...post,
            id: post.id || Date.now(), // Уникальный ID если не задан
            isLocal: true, // Помечаем как локальный пост
            createdAt: new Date().toISOString()
        };
        
        const updatedPosts = [newPost, ...savedPosts];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
        return newPost;
    } catch (error) {
        console.error('Error saving post to localStorage:', error);
        return null;
    }
};

// Обновить все посты (для лайков и других изменений)
export const updateAllPosts = (allPosts) => {
    try {
        // Сохраняем только локальные посты
        const localPosts = allPosts.filter(post => post.isLocal);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localPosts));
        return localPosts;
    } catch (error) {
        console.error('Error updating posts in localStorage:', error);
        return getSavedPosts();
    }
};

// Удалить пост
export const deletePost = (postId) => {
    try {
        const savedPosts = getSavedPosts();
        const updatedPosts = savedPosts.filter(post => post.id !== postId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
        return updatedPosts;
    } catch (error) {
        console.error('Error deleting post from localStorage:', error);
        return getSavedPosts();
    }
};


