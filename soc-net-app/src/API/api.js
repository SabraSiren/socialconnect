import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {'Content-Type': 'application/json'}
});

const ACCESS_KEY = 'accessToken';

api.interceptors.request.use((config) => {
        try {
            const token = localStorage.getItem(ACCESS_KEY);
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                // если заголовок был установлен ранее, удаляем его
                delete config.headers.Authorization;
            }
        } catch (e) {
            // не ломаем запрос из-за localStorage ошибок
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;