import React, {useState} from "react";
import styles from "./PostForm.module.css";
import commonStyles from "../../App.module.css";
import {useDispatch} from "react-redux";
import {createPost} from "../../store/slices/postsSlice";

const PostForm = () => {
    const dispatch = useDispatch();
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
            const payload = {
                content: text,
            };

            await dispatch(createPost(payload)).unwrap();
            setContent("");
        } catch (err) {
            setError(err || 'Error creating post');
        } finally {
            setLoading(false);
        }
    };


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