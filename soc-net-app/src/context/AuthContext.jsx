import React, {createContext, useContext, useEffect, useReducer} from 'react';
import AuthService from '../API/AuthService';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return {...state, isLoading: true, error: null};
        case 'AUTH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isAuth: true,
                user: action.payload,
                error: null
            };
        case 'AUTH_FAIL':
            return {
                ...state,
                isLoading: false,
                isAuth: false,
                user: null,
                error: action.payload
            };
        case 'AUTH_LOGOUT':
            return {
                isLoading: false,
                isAuth: false,
                user: null,
                error: null
            };
        case 'CLEAR_ERROR':
            return {...state, error: null};
        default:
            return state;
    }
};

const initialState = {
    isAuth: false,
    isLoading: true,
    user: null,
    error: null
};

export const AuthContext = createContext(null);

// удобный хук для использования контекста
export const useAuth = () => useContext(AuthContext);

// Провайдер авторизации: управляет состоянием и предоставляет экшены (login/register/logout).
export const AuthProvider = ({children}) => {
    // создаём один экземпляр authService (singleton) — внутри него создаётся axios instance и интерцепторы
    const auth = AuthService;
    const [state, dispatch] = useReducer(authReducer, initialState);

    //Проверка авторизации при загрузке приложения (автовход по cookie с JWT).
    useEffect(() => {
        let cancelled = false;

        const checkAuth = async () => {
            try {
                dispatch({type: 'AUTH_START'});
                const userData = await auth.getCurrentUser();

                if (!cancelled) {
                    if (userData) {
                        dispatch({type: 'AUTH_SUCCESS', payload: userData});
                    } else {
                        dispatch({type: 'AUTH_FAIL', payload: null});
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Ошибка проверки авторизации:', err);
                    dispatch({type: 'AUTH_FAIL', payload: null});
                }
            }
        };

        checkAuth();

        return () => {
            cancelled = true;
        };
    }, [auth]);


    const login = async (credentials) => {
        try {
            dispatch({type: 'AUTH_START'});

            const data = await auth.login({
                username: credentials.username,
                password: credentials.password,
            });

            let userData = data?.user ?? null;
            if (!userData) {
                try {
                    userData = await auth.getCurrentUser();
                } catch (e) {
                    console.warn('Не удалось получить пользователя после логина', e);
                }
            }

            console.log('AuthProvider user loaded:', userData);
            dispatch({type: 'AUTH_SUCCESS', payload: userData});

            return {success: true};
        } catch (err) {
            console.error('Ошибка входа:', err);
            const message = err?.message || 'Login failed';
            // Обрабатываем ошибку 401 с понятным сообщением
            const friendlyMessage = err?.message === 'Incorrect login or password'
                ? 'Incorrect login or password'
                : message;

            dispatch({type: 'AUTH_FAIL', payload: friendlyMessage});
            return {success: false, error: friendlyMessage};
        }
    };

    const register = async (userData) => {
        try {
            dispatch({type: 'AUTH_START'});

            const res = await auth.register({
                username: userData.username,
                password: userData.password,
                full_name: userData.full_name,
            });

            let createdUser = res?.user ?? null;
            if (!createdUser) {
                try {
                    createdUser = await auth.getCurrentUser();
                } catch (e) {
                    // игнорируем ошибку получения пользователя
                }
            }

            dispatch({type: 'AUTH_SUCCESS', payload: createdUser});
            return {success: true};
        } catch (err) {
            console.error('Ошибка регистрации:', err);
            const message = err?.message || 'Register failed';
            dispatch({type: 'AUTH_FAIL', payload: message});
            return {success: false, error: message};
        }
    };

    const logout = async () => {
        try {
            auth.logout();
            dispatch({type: 'AUTH_LOGOUT'});
        } catch (err) {
            console.error('Ошибка выхода:', err);
            // Все равно сбрасываем состояние даже при ошибке
            dispatch({type: 'AUTH_LOGOUT'});
        }
    };

    const clearError = () => dispatch({type: 'CLEAR_ERROR'});


    // Значение, которое будет доступно дочерним компонентам
    const value = {
        isAuth: state.isAuth,
        isLoading: state.isLoading,
        user: state.user,
        error: state.error,
        login,
        register,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

