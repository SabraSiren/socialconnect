import React, {useContext} from "react";
import styles from "./UserProfile.module.css";
import {User, LogOut} from "lucide-react"
import {AuthContext} from "../context/AuthContext";

const UserProfile = ({postsCount}) => {

    const { setIsAuth, username, setUsername} = useContext(AuthContext);

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem("auth");
        localStorage.removeItem("username");
        setUsername("");
    }

    return (
        <div className={styles.userInfoCard}>
            <div className={styles.cardContent}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        <div className={styles.emptyAvatar}>
                            <User className={styles.userIcon}/>
                        </div>
                    </div>
                    <div className={styles.userDetails}>
                        <h1 className={styles.userName}>{username}</h1>
                        <p className={styles.userUsername}>@{username}</p>
                        <div className={styles.userStats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{postsCount}</span>
                                <span className={styles.statLabel}>Posts</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>1.2k</span>
                                <span className={styles.statLabel}>Followers</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>892</span>
                                <span className={styles.statLabel}>Following</span>
                            </div>
                        </div>
                        <button className={styles.logoutButton}>
                            <LogOut className={styles.logoutIcon} onClick={logout} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
