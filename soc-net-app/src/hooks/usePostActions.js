import { useCallback } from "react";
import { savePost, updateAllPosts, deletePost } from "../utils/postStorage";
import { createPost } from "../utils/postUtils";

// Хук для действий с постами
export const usePostActions = (setPosts) => {
    const handlePostSubmit = useCallback((content) => {
        const newPost = createPost(content);
        
        // Сохраняем в LocalStorage
        const savedPost = savePost(newPost);
        if (savedPost) {
            setPosts(prev => [savedPost, ...prev]);
        }
    }, [setPosts]);

    const handleLike = useCallback((postId) => {
        setPosts((prev) => {
            const updatedPosts = prev.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    };
                }
                return post;
            });
            
            // Сохраняем все локальные посты в LocalStorage
            updateAllPosts(updatedPosts);
            
            return updatedPosts;
        });
    }, [setPosts]);

    const handleDelete = useCallback((postId) => {
        // Удаляем пост из состояния
        setPosts((prev) => {
            const postToDelete = prev.find(post => post.id === postId);
            const updatedPosts = prev.filter(post => post.id !== postId);
            
            // Если это локальный пост, удаляем из LocalStorage
            if (postToDelete && postToDelete.isLocal) {
                deletePost(postId);
            }
            // API посты просто скрываются из интерфейса (не удаляются из API)
            
            return updatedPosts;
        });
    }, [setPosts]);

    return {
        handlePostSubmit,
        handleLike,
        handleDelete
    };
};
