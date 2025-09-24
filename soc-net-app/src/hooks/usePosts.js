import { useState, useEffect, useCallback } from "react";
import { fetchPosts, fetchCommentsCountByPostId } from "../API/PostService";
import { getSavedPosts } from "../utils/postStorage";
import { normalizeApiPost, normalizeLocalPost } from "../utils/postUtils";

// Хук для загрузки постов
export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const loadPosts = useCallback(() => {
        let isMounted = true;
        setError("");
        
        // Загружаем локальные посты сразу
        const savedPosts = getSavedPosts();
        const localPosts = savedPosts.map(normalizeLocalPost);
        
        // Сначала показываем локальные посты
        setPosts(localPosts);
        
        // Загружаем API посты параллельно
        setIsLoading(true);
        fetchPosts()
            .then(async (data) => {
                if (!isMounted) return;
                const apiPosts = Array.isArray(data) ? data.slice(0, 10) : [];
                
                // Загружаем количество комментариев для каждого поста
                const postsWithComments = await Promise.all(
                    apiPosts.map(async (post) => {
                        try {
                            const commentsCount = await fetchCommentsCountByPostId(post.id);
                            return normalizeApiPost(post, commentsCount);
                        } catch (error) {
                            console.warn(`Failed to load comments count for post ${post.id}:`, error);
                            return normalizeApiPost(post, 0);
                        }
                    })
                );
                
                // Объединяем локальные посты (сверху) с API постами
                const allPosts = [...localPosts, ...postsWithComments];
                setPosts(allPosts);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError("Failed to load posts");
                // Локальные посты уже загружены, ошибка только для API
            })
            .finally(() => {
                if (!isMounted) return;
                setIsLoading(false);
            });
        
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const handleRetry = useCallback(() => {
        loadPosts();
    }, [loadPosts]);

    return {
        posts,
        setPosts,
        isLoading,
        error,
        handleRetry
    };
};
