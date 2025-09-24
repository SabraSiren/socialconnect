import React from "react";
import styles from "./Loader.module.css";

const Loader = ({ size = "medium", text = "Loading..." }) => {
    return (
        <div className={styles.loaderContainer}>
            <div className={`${styles.spinner} ${styles[size]}`}></div>
            {text && <p className={styles.loaderText}>{text}</p>}
        </div>
    );
};

export default Loader;
