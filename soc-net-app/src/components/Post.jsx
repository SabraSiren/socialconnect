import React from "react";
import {Heart, MessageCircle, MoreHorizontal} from "lucide-react"
import styles from "./Post.module.css"


const Post = ({post, onLike}) => {
    return (
        <div className={styles.postCard}>
            <div className={styles.postHeader}>
                <div className={styles.postTime}>
                    <span>{post.timestamp}</span>
                    <button className={styles.moreButton}>
                        <MoreHorizontal className={styles.moreIcon}/>
                    </button>
                </div>
            </div>
            <div className={styles.cardContent}>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postActions}>
                    <button
                        onClick={() => onLike(post.id)}
                        className={`${styles.actionButton} ${post.isLiked ? styles.liked : ""}`}>
                        <Heart className={`${styles.actionIcon} ${post.isLiked ? styles.heartFilled : ""}`} />
                        <span>{post.likes}</span>
                    </button>
                    <button className={styles.actionButton}>
                        <MessageCircle className={styles.actionIcon} />
                        <span>{post.comments}</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Post;
