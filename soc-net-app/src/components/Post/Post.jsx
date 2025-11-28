import React from "react";
import {Link} from "react-router-dom";
import {Heart, MessageCircle, Trash2} from "lucide-react"
import styles from "./Post.module.css"
import commonStyles from "../../App.module.css"


const Post = ({post = {}, onLike, onDelete}) => {
    const {
        id = null,
        content = "",
        likes = 0,
        timestamp = null,
        liked_by_user = false
    } = post || {};

    const handleDelete = (e) => {
        e?.stopPropagation?.();
        if (typeof onDelete === "function" && id != null) {
            onDelete(id);
        }
    };

    const handleLike = (e) => {
        e?.stopPropagation?.();
        if (typeof onLike === "function" && id != null) {
            onLike(id);
        }
    };

    const formattedTime = (() => {
        if (!timestamp) return "";
        const d = new Date(timestamp);
        return isNaN(d.getTime()) ? String(timestamp) : d.toLocaleString();
    })();

    return (
        <div className={styles.postCard}>
            <div className={styles.postHeader}>
                <div className={styles.postTime}>
                    <span>{formattedTime}</span>

                    {typeof onDelete === "function" && id != null && (
                        <button
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            title="Delete post"
                            type="button"
                        >
                            <Trash2 className={styles.deleteIcon}/>
                        </button>
                    )}
                </div>
            </div>
            <div className={commonStyles.cardContentCompact}>
                <p className={styles.postContent}>{content}</p>
                <div className={styles.postActions}>
                    <button
                        onClick={handleLike}
                        className={`${styles.actionButton} ${liked_by_user ? styles.liked : ""}`}>
                        <Heart className={`${styles.actionIcon} ${liked_by_user ? styles.heartFilled : ""}`}/>
                        <span>{Number.isFinite(likes) ? likes : 0}</span>
                    </button>
                    <Link
                        to={`/comments/${id}`}
                        className={styles.actionButton}
                    >
                        <MessageCircle className={styles.actionIcon}/>
                        <span>0</span>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default Post;
