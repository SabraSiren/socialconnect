import React from "react";
import styles from "./PostList.module.css";
import Post from "./Post";

const PostList = ({posts, onLike}) => {
    if (posts.length === 0) {
        return (
            <div className={styles.feed}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyContent}>
                        <p className={styles.emptyText}>No posts yet. Share your first thought!</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.feed}>
            {posts.map((post) => (
                <Post key={post.id} post={post} onLike={onLike} />
            ))}
        </div>
    )
}
//добавить иф пост ленс 0 ретерн постов добавить

export default PostList;
