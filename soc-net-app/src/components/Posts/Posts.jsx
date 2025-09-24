import React, { useEffect, useMemo } from "react";
import Post from "../Post/Post";
import Loader from "../UI/Loader";
import { usePosts } from "../../hooks/usePosts";
import { usePostActions } from "../../hooks/usePostActions";
import styles from "./Posts.module.css";

const Posts = ({onPostsCountChange, newPostContent, onNewPostSubmitted}) => {
    const { posts, setPosts, isLoading, error, handleRetry } = usePosts();
    const { handlePostSubmit, handleLike, handleDelete } = usePostActions(setPosts);

    // Обновляем счетчик постов
    useEffect(() => {
        if (onPostsCountChange) onPostsCountChange(posts.length);
    }, [posts.length, onPostsCountChange]);

    // Обрабатываем новый пост из пропса
    useEffect(() => {
        if (newPostContent && newPostContent.trim()) {
            handlePostSubmit(newPostContent);
            onNewPostSubmitted(); // Очищаем состояние в родителе
        }
    }, [newPostContent, handlePostSubmit, onNewPostSubmitted]);

    // Мемоизируем отфильтрованные посты для отображения
    const displayedPosts = useMemo(() => {
        return posts.slice(0, 10);
    }, [posts]);

    return (
        <>
            {posts.length === 0 ? (
                <div className={styles.feed}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyContent}>
                            <p className={styles.emptyText}>No posts yet. Share your first thought!</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.feed}>
                    {displayedPosts.map((post) => (
                        <Post key={post.id} post={post} onLike={handleLike} onDelete={handleDelete} />
                    ))}
                </div>
            )}
            {isLoading && (
                <Loader text="Loading more posts..." />
            )}
            {error && (
                <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{error}</p>
                    <button 
                        onClick={handleRetry}
                        className={styles.retryButton}
                    >
                        Try Again
                    </button>
                </div>
            )}
        </>
    );
};

export default Posts;