import React, {useState, useEffect, useCallback, useMemo} from "react";
import {Link, useParams} from "react-router-dom";
import {fetchPostCommentsById} from "../../API/PostService";
import Loader from "../UI/Loader";
import {ArrowLeft, MessageCircle} from "lucide-react";
import styles from "./Comments.module.css";

const Comments = () => {
    const {postId} = useParams();
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Простая функция загрузки комментариев
    const loadComments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Простая проверка: если ID больше 100, то это локальный пост
            if (parseInt(postId) > 100) {
                setComments([]);
            } else {
                const commentsData = await fetchPostCommentsById(postId);
                setComments(commentsData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (!postId) return;
        loadComments().catch((err) => console.error(err));
    }, [postId, loadComments]);


    if (isLoading) {
        return <Loader/>;
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>Error loading comments: {error}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <Link to="/profile" className={styles.backButton}>
                        <ArrowLeft className={styles.backIcon}/>
                        Back to profile
                    </Link>
                </div>
                <div className={styles.headerContent}>
                    <div className={styles.titleContainer}>
                        <MessageCircle className={styles.titleIcon}/>
                        <h1 className={styles.title}>Comments: {comments.length}</h1>
                    </div>
                </div>
            </div>

            <div className={styles.commentsList}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.commentCard}>
                            <div className={styles.commentHeader}>
                                <div className={styles.commentAuthor}>
                                    <span className={styles.authorName}>{comment.name}</span>
                                </div>
                            </div>

                            <div className={styles.commentContent}>
                                <p className={styles.commentBody}>{comment.body}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyContent}>

                            <h3 className={styles.emptyTitle}>No comments yet</h3>
                            <p className={styles.emptyText}>
                                This post doesn't have any comments yet. Be the first to comment!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;
