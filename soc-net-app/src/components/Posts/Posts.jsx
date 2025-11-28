import React, {useCallback, useEffect, useState, useRef} from "react";
import Post from "../Post/Post";
import styles from "./Posts.module.css";
import PostService from "../../API/PostService";

const Posts = ({refreshKey, onPostDeleted, onPostUpdated, onCountChange}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Используем useRef для onCountChange, чтобы loadPosts не вызывала постоянных ререндеров
    const onCountChangeRef = useRef(onCountChange);
    useEffect(() => {
        onCountChangeRef.current = onCountChange;
    }, [onCountChange]);


    const loadPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await PostService.getPosts();
            const list = Array.isArray(res?.posts) ? res.posts : [];
            setPosts(list);
            if (onCountChangeRef.current) onCountChangeRef.current(list.length);
        } catch (err) {
            setError(err?.response?.data?.message ||
                err?.message || 'Error loading post');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPosts();
        // Ошибки уже обработаны в loadPosts
    }, [loadPosts, refreshKey]);


    const handleRetry = () => {
        loadPosts();
        // Ошибки уже обработаны в loadPosts
    };


    // Удаление поста — после успешного удаления перезагружаем список и уведомляем родителя
    const handleDelete = useCallback(
        async (id) => {
            setError(null);
            try {
                await PostService.deletePost(id);
                if (onPostDeleted) onPostDeleted(id);
            } catch (err) {
                setError(err?.response?.data?.message || 'Error deleting post');
            }
        },
        [onPostDeleted]
    );


    const handleLike = useCallback(
        async (id) => {
            setError(null);
            try {
                const updated = await PostService.likePost(id);

                if (updated && updated.id != null) {
                    // если сервер вернул обновлённый объект — применяем изменения локально
                    setPosts((prev) =>
                        prev.map((p) => (p.id === updated.id ? {...p, ...updated} : p))
                    );
                    if (typeof onPostUpdated === "function") onPostUpdated(id);
                } else {
                    await loadPosts();
                    if (typeof onPostUpdated === "function") onPostUpdated(id);
                }
            } catch (err) {
                console.error("Ошибка при лайке:", err);
                setError(err?.message || "Error liking post.");
            }
        },
        [loadPosts, onPostUpdated]
    );


    return (
        <div>
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

            {!loading && !error && posts.length === 0 && (
                <div className={styles.feed}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyContent}>
                            <p className={styles.emptyText}>No posts yet. Share your first thought!</p>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.feed}>
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    )
};

export default Posts;

