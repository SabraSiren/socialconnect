import React from "react";
import styles from "./PostForm.module.css";
import {useState} from "react";


const PostForm = ({onPostSubmit}) => {
    const [newPost, setNewPost] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return

        onPostSubmit(newPost)
        setNewPost("")
    }


    return (
        <div className={styles.postForm}>
            <div className={styles.cardContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.postInputContainer}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className={styles.postInput}
                            rows={3}
                        />
                    </div>
                    <div className={styles.postActions}>
                        <button type='submit' disabled={!newPost.trim()} className={styles.postButton}>
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostForm;
