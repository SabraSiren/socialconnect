import React, {useContext, useState} from "react";
import UserProfile from "./UserProfile";
import PostList from "./PostList";
import PostForm from "./PostForm";
import styles from "../App.module.css";
import {AuthContext} from "../context/AuthContext";


const ProfilePage = () => {

    const [posts, setPosts] = useState([]);
    const { username } = useContext(AuthContext);

    const handlePostSubmit = (content) => {
        const post = {
            id: posts.length + 1,
            author: {
                name: username,
                avatar: null,
                username: "username",
            },
            content,
            timestamp: new Date().toLocaleDateString(),
            likes: 0,
            comments: 0,
            isLiked: false,
        }
        setPosts([post, ...posts])
    }

    const handleLike = (postId) => {
        setPosts(
            posts.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        isLiked: !post.isLiked,
                        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    }
                    : post,
            ),
        )
    }


    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <UserProfile postsCount={posts.length}/>
                <PostForm onPostSubmit={handlePostSubmit}/>
                <PostList posts={posts} onLike={handleLike}/>
            </div>
        </div>
    );
};

export default ProfilePage;
