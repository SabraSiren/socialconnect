import React, {useState} from "react";
import styles from "./PostForm.module.css";
import commonStyles from "../../App.module.css";



const PostForm = ({onPostSubmit}) => {
    const [newPost, setNewPost] = useState("");


    const addNewPost = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return

        if (onPostSubmit) {
            onPostSubmit(newPost)
        }
        setNewPost("")
    }


    return (
        <div className={styles.postForm}>
            <div className={commonStyles.cardContent}>
                <form onSubmit={addNewPost}>
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
                        <button type='submit'  className={styles.postButton}>
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostForm;
