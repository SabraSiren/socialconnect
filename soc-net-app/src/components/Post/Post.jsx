import React from "react";
import {Link} from "react-router-dom";
import {Heart, MessageCircle, Trash2} from "lucide-react"
import styles from "./Post.module.css"
import commonStyles from "../../App.module.css"


const Post = ({post, onLike, onDelete}) => {
    return (
        <div className={styles.postCard}>
            <div className={styles.postHeader}>
                <div className={styles.postTime}>
                    <span>{post.timestamp}</span>
                    {onDelete && (
                        <button 
                            className={styles.deleteButton}
                            onClick={() => onDelete(post.id)}
                            title={post.isLocal ? "Delete post" : "Hide post"}
                        >
                            <Trash2 className={styles.deleteIcon} />
                        </button>
                    )}
                </div>
            </div>
            <div className={commonStyles.cardContentCompact}>
                <p className={styles.postContent}>{post.content}</p>
                <div className={styles.postActions}>
                    <button
                        onClick={() => onLike(post.id)}
                        className={`${styles.actionButton} ${post.isLiked ? styles.liked : ""}`}>
                        <Heart className={`${styles.actionIcon} ${post.isLiked ? styles.heartFilled : ""}`} />
                        <span>{post.likes}</span>
                    </button>
                    <Link 
                        to={`/comments/${post.id}`} 
                        className={styles.actionButton}
                    >
                        <MessageCircle className={styles.actionIcon} />
                        <span>{post.comments}</span>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Post;
