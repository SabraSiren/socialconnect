import React, {useState} from "react";
import UserProfile from "../UserProfile/UserProfile";
import PostForm from "../PostForm/PostForm";
import Posts from "../Posts/Posts";
import styles from "../../App.module.css";


const ProfilePage = () => {
    const [postsCount, setPostsCount] = useState(0);
    const [newPostContent, setNewPostContent] = useState("");

    const handlePostSubmit = (content) => {
        setNewPostContent(content);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.profileCard}>
                    <UserProfile postsCount={postsCount}/>
                    <div className={styles.divider}></div>
                    <PostForm onPostSubmit={handlePostSubmit} />
                </div>
                <Posts 
                    onPostsCountChange={setPostsCount} 
                    newPostContent={newPostContent}
                    onNewPostSubmitted={() => setNewPostContent("")}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
