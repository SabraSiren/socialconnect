import {Link} from "react-router-dom";
import {ArrowLeft, MessageCircle} from "lucide-react";
import styles from "./Comments.module.css";

const Comments = () => {

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
                        <h1 className={styles.title}>Comments: 0</h1>
                    </div>
                </div>
            </div>
            <div className={styles.emptyState}>
                <div className={styles.emptyContent}>

                    <h3 className={styles.emptyTitle}>No comments yet</h3>
                    <p className={styles.emptyText}>
                        This post doesn't have any comments yet. Be the first to comment!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Comments;
