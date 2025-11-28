import React, {useState} from "react";
import styles from "./PostForm.module.css";
import commonStyles from "../../App.module.css";
import PostService from "../../API/PostService";

const PostForm = ({onCreate}) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addNewPost = async (e) => {
        e.preventDefault();
        const text = content?.trim();
        if (!text) {
            setError("Input post text");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            console.debug('Posting:', text);
            await PostService.createPost({content: text});
            console.debug('Post created', content);
            setContent("");
            // уведомим родителя (ProfilePage) — он увеличит refreshKey и Posts рефетчит
            if (onCreate) onCreate();
        } catch (err) {
            setError(err?.response?.data?.message ||
                err?.message || 'Error creating post');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className={commonStyles.cardContent}>
            <form onSubmit={addNewPost} name="postform">
                <div className={styles.postInputContainer}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={styles.postInput}
                            rows={3}
                        />
                </div>
                <div className={styles.postActions}>
                    <button type='submit'
                            className={styles.postButton}
                            disabled={loading || !content.trim()}>
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;