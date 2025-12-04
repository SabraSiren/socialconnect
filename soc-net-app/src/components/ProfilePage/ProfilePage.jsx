import React from "react";
import styles from "../../App.module.css";
import UserProfile from "../UserProfile/UserProfile";
import PostForm from "../PostForm/PostForm";
import Posts from "../Posts/Posts";


const ProfilePage = () => {

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.profileCard}>
                    <UserProfile/>
                    <div className={styles.divider}></div>
                    <PostForm/>
                </div>
                <Posts/>
            </div>
        </div>
    );
};

export default ProfilePage;