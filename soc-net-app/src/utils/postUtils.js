// Утилиты для работы с постами

// Создать новый пост
export const createPost = (content) => ({
    content,
    timestamp: "now",
    likes: 0,
    comments: 0,
    isLiked: false,
});

// Нормализовать API пост
export const normalizeApiPost = (apiPost, commentsCount = 0) => ({
    id: apiPost.id,
    content: apiPost.body,
    timestamp: "now",
    likes: 0,
    comments: commentsCount,
    isLiked: false,
    isLocal: false, // API посты не локальные
});

// Нормализовать локальный пост
export const normalizeLocalPost = (localPost) => ({
    ...localPost,
    timestamp: localPost.timestamp || "now",
    likes: localPost.likes || 0,
    comments: localPost.comments || 0,
    isLiked: localPost.isLiked || false,
    isLocal: true,
});
