import {User, LogOut} from "lucide-react";
import {useAuth} from '../../context/AuthContext';
import styles from './UserProfile.module.css';
import commonStyles from '../../App.module.css';

const UserProfile = ({user, postCount = 0, onLogout}) => {
    const auth = useAuth();

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
                        <h1 className={styles.userName}>{user.full_name}</h1>
                        <div className={styles.userStats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{postCount}</span>
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
                        <button className={styles.logoutButton} onClick={onLogout}>
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
