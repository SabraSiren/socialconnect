import styles from "./LoginPage.module.css";
import commonStyles from "../../App.module.css";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const {login, register, error, clearError} = useAuth();
    const navigate = useNavigate();
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    // Режим отображения формы: вход (login) или регистрация (register).
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Данные формы. Поля совпадают с ожидаемыми сервером.
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        full_name: ""
    });

    // Обработчик изменения полей формы. Синхронизирует локальное состояние с инпутами и очищает текст ошибки при вводе.
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Очищаем ошибки при изменении полей.
        if (error) clearError();
    };


    //Обработчик отправки формы. В зависимости от текущего режима выполняет вход или регистрацию.
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Формируем полезную нагрузку. Подготавливаем payload в соответствии с режимом.
        const credentials = isLoginMode
            ? {username: formData.username, password: formData.password}
            : {username: formData.username, password: formData.password, full_name: formData.full_name};

        console.log(`Отправляем ${isLoginMode ? 'вход' : 'регистрацию'}:`, credentials);
        setIsButtonLoading(true);
        // Выполняем запрос: вход или регистрация.
        try {
            const result = isLoginMode
                ? await login(credentials)
                : await register(credentials);

            // AuthContext возвращает { success: true } при успешной операции.
            if (result && result.success) {
                console.log('Авторизация/регистрация успешна, выполняем переход...');
                navigate('/profile');
            } else {
                // При неуспехе ошибка уже установлена в контексте и отображается в UI.
                console.warn('Операция неуспешна', result);
            }
        } catch (err) {
            // AuthContext уже возвращает объект с ошибкой; но на всякий случай логируем.
            console.error('Ошибка при отправке формы:', err);
        } finally {
            // Сбрасываем локальный лоадер в любом случае.
            setIsButtonLoading(false);
        }
    };


    // Переключение между режимами (login/register). Сбрасывает значения формы и очищает ошибку.
    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setFormData({
            username: "",
            password: "",
            full_name: ""
        });
        clearError();
    };


    return (
        <div className={commonStyles.pageContainer}>
            <div className={styles.authCard}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h1 className={styles.title}>Welcome to SocialConnect</h1>
                        <p className={styles.description}>Connect with friends and share your moments</p>
                    </div>

                    {/* Переключатель режимов (кнопки) */}
                    <div className={styles.modeToggle}>
                        <button
                            className={`${styles.toggleButton} ${isLoginMode ? styles.active : ''}`}
                            onClick={() => !isLoginMode && toggleMode()}
                        >
                            Login
                        </button>
                        <button
                            className={`${styles.toggleButton} ${!isLoginMode ? styles.active : ''}`}
                            onClick={() => isLoginMode && toggleMode()}
                        >
                            Register
                        </button>
                    </div>

                    <div className={commonStyles.cardContent}>
                        {/* Блок отображения текстовой ошибки */}
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formFields}>
                                {/* Поле: логин */}
                                <div className={styles.field}>
                                    <label htmlFor="login" className={styles.label}>
                                        Login
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter username"
                                        minLength="3"
                                        maxLength="50"
                                        required
                                        onChange={handleInputChange}
                                        value={formData.username}
                                        className={styles.input}
                                    />
                                </div>

                                {/* Поле: пароль */}
                                <div className={styles.field}>
                                    <label htmlFor="password" className={styles.label}>
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter password"
                                        minLength="6"
                                        maxLength="128"
                                        required
                                        onChange={handleInputChange}
                                        value={formData.password}
                                        className={styles.input}
                                    />
                                </div>

                                {/* Поле: отображаемое имя (только для регистрации; видно на странице профиля) */}
                                {!isLoginMode && (
                                    <div className={styles.field}>
                                        <label htmlFor="full_name" className={styles.label}>
                                            Full name
                                        </label>
                                        <input
                                            id="full_name"
                                            name="full_name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            minLength="1"
                                            maxLength="30"
                                            required={!isLoginMode}
                                            onChange={handleInputChange}
                                            value={formData.full_name}
                                            className={styles.input}
                                        />
                                    </div>
                                )}

                                {/* Кнопка отправки формы */}
                                <button
                                    type="submit"
                                    disabled={isButtonLoading}
                                    className={styles.submitButton}>
                                    {isButtonLoading ? 'Loading...' : (isLoginMode ? 'Sign in' : 'Sign up')}
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
