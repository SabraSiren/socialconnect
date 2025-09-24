import styles from "./LoginPage.module.css";
import commonStyles from "../../App.module.css";
import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext";


const LoginPage = () => {
    const {setIsAuth, setUsername } = useContext(AuthContext);
    const [name, setName] = useState("");


    const login = (event) => {
        event.preventDefault();
        localStorage.setItem("auth", "true")
        localStorage.setItem("username", name);
        setUsername(name);
        setIsAuth(true);
    }


    return (
        <div className={commonStyles.pageContainer}>
            <div className={styles.authCard}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h1 className={styles.title}>Welcome to SocialConnect</h1>
                        <p className={styles.description}>Connect with friends and share your moments</p>
                    </div>
                    <div className={commonStyles.cardContent}>
                        <form onSubmit={login} className={styles.form}>
                            <div className={styles.formFields}>
                                <div className={styles.field}>
                                    <label htmlFor="name" className={styles.label}>
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="name"
                                        placeholder="Enter your name"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="password" className={styles.label}>
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.submitButton}>
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
