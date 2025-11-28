import React, {useState} from "react";
import UserProfile from "../UserProfile/UserProfile";
import PostForm from "../PostForm/PostForm";
import Posts from "../Posts/Posts";
import styles from "../../App.module.css";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const [refreshKey, setRefreshKey] = useState(0);
    const [postCount, setPostCount] = useState(0);

    // Триггер для перезагрузки списка постов
    const bumpRefresh = () => setRefreshKey(k => k + 1);

    const handlePostCreated = () => {
        bumpRefresh();
    };

    const handlePostDeleted = () => {
        bumpRefresh();
    };

    const handlePostUpdated = () => bumpRefresh();

    const handleCountChange = (count) => setPostCount(count ?? 0);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при выходе:', err);
        }
    };
    console.log('ProfilePage user:', user);

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.profileCard}>
                    <UserProfile user={user} postCount={postCount} onLogout={handleLogout}/>
                    <div className={styles.divider}></div>
                    <PostForm onCreate={handlePostCreated}/>
                </div>
                <Posts
                    refreshKey={refreshKey}
                    onPostDeleted={handlePostDeleted}
                    onPostUpdated={handlePostUpdated}
                    onCountChange={handleCountChange}
                />
            </div>
        </div>
    );
};

export default ProfilePage;