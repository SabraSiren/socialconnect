import React from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {User, LogOut} from "lucide-react";
import styles from './UserProfile.module.css';
import commonStyles from '../../App.module.css';
import {logout} from "../../store/slices/authSlice";


const UserProfile = ({onLogout}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user} = useSelector(state => state.auth);
    const postsCount = useSelector(state => state.posts.items.length);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при выходе:', err);
        }
    };

    console.log('User:', user);

    return (
        <div className={commonStyles.profileCard}>
            <div className={commonStyles.cardContent}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        <div className={styles.emptyAvatar}>
                            <User className={styles.userIcon}/>
                        </div>
                    </div>
                    <div className={styles.userDetails}>
                        <h1 className={styles.userName}>{user?.full_name}</h1>
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
                        <button className={styles.logoutButton} onClick={handleLogout}>
                            <LogOut className={styles.logoutIcon}/>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
