import API from "./api";

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'authUser';


const AuthService = (() => {
    const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
    const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
    const saveAccessToken = (t) => (t ? localStorage.setItem(ACCESS_KEY, t) : localStorage.removeItem(ACCESS_KEY));
    const saveRefreshToken = (t) => (t ? localStorage.setItem(REFRESH_KEY, t) : localStorage.removeItem(REFRESH_KEY));
    const saveUser = (u) => {
        if (u == null) localStorage.removeItem(USER_KEY);
        else {
            try {
                localStorage.setItem(USER_KEY, JSON.stringify(u));
            } catch (e) {
            }
        }
    };

    // Рефреш механика.
    let isRefreshing = false;
    let failedQueue = []; // { resolve, reject }

    const processQueue = (error, token = null) => {
        failedQueue.forEach((p) => {
            if (error) p.reject(error);
            else p.resolve(token);
        });
        failedQueue = [];
    };

// Функция, которая попытается обновить токен (вызывается один раз в рефреш-процессе)
    const refreshTokenRequest = async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        const res = await API.post('/auth/refresh', {refresh_token: refreshToken});
        return res.data;
    };

// Interceptor: ловим 401 и пробуем рефрешнуть
    let interceptorId = null;
    const ensureResponseInterceptor = () => {
        if (interceptorId !== null) return;

        API.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Проверка URL
                const isLoginOrRegister =
                    originalRequest.url.includes('/auth/login') ||
                    originalRequest.url.includes('/auth/register');

                // если нет config или это не 401 — просто проброс
                if (!originalRequest || !error.response || error.response.status !== 401 || isLoginOrRegister) {
                    return Promise.reject(error);
                }

                // избегаем бесконечных ретраев
                if (originalRequest._retry) {
                    return Promise.reject(error);
                }

                // если уже идёт рефреш — ставим этот запрос в очередь и ждём
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({resolve, reject});
                    })
                        .then((token) => {
                            originalRequest._retry = true;
                            originalRequest.headers = originalRequest.headers || {};
                            originalRequest.headers.Authorization = 'Bearer ' + token;
                            return API(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                // начинаем рефреш
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const data = await refreshTokenRequest();
                    // ожидаем data.access_token и data.refresh_token
                    const {access_token: newAccess, refresh_token: newRefresh} = data ?? {};

                    if (!newAccess) return Promise.reject(new Error('No access_token in refresh response'));

                    // сохраняем и ставим header
                    saveAccessToken(newAccess);
                    if (newRefresh) saveRefreshToken(newRefresh);

                    processQueue(null, newAccess);
                    isRefreshing = false;

                    // повторяем оригинальный запрос с новым токеном
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = 'Bearer ' + newAccess;
                    return API(originalRequest);
                } catch (err) {
                    // рефреш не удался — очистим локально (логин требуется заново)
                    processQueue(err, null);
                    isRefreshing = false;
                    saveAccessToken(null);
                    saveRefreshToken(null);
                    saveUser(null);
                    return Promise.reject(err);
                }
            }
        );
    };
    ensureResponseInterceptor();


    async function login({username, password}) {
        try {
            const res = await API.post('/auth/login', {username, password});
            const data = res?.data ?? {};
            const {access_token: accessToken, refresh_token: refreshToken} = data ?? {};

            if (accessToken) saveAccessToken(accessToken);
            if (refreshToken) saveRefreshToken(refreshToken);
            return data;
        } catch (err) {
            if (err?.response?.status === 401) {
                throw new Error('Incorrect login or password');
            }
            const message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Login error';
            console.error("Детальная ошибка сервера при логине:", err?.response?.data);
            throw new Error(message);
        }
    }


    async function register({username, password, full_name}) {
        try {
            const res = await API.post('/auth/register', {username, password, full_name});
            const data = res?.data ?? {};
            // Если сервер вернул токены, сохраняем их
            const {access_token: accessToken, refresh_token: refreshToken} = data ?? {};
            if (accessToken) saveAccessToken(accessToken);
            if (refreshToken) saveRefreshToken(refreshToken);
            return data;
        } catch (err) {
            let message = 'Register error';

            if (err?.response?.status === 400) {
                // Ошибка валидации - скорее всего username уже занят
                const errorDetail = err?.response?.data?.detail;
                if (errorDetail) {
                    message = errorDetail;
                } else if (err?.response?.data?.message) {
                    message = err.response.data.message;
                } else {
                    message = 'Username already exists';
                }
            } else if (err?.response?.data?.message) {
                message = err.response.data.message;
            } else if (err?.response?.data?.error) {
                message = err.response.data.error;
            } else if (err?.message) {
                message = err.message;
            }

            console.error("Детальная ошибка сервера при регистрации:", err?.response?.data);
            throw new Error(message);
        }
    }

    function logout() {
        // нет endpointа на сервере — локально чистим storage и headers.
        saveAccessToken(null);
        saveRefreshToken(null);
        saveUser(null);
    }

    async function getCurrentUser() {
        const accessToken = getAccessToken();
        if (!accessToken) {
            // нет токена — не делаем сетевой запрос, читаем только из localStorage.
            const stored = localStorage.getItem(USER_KEY);
            return stored ? JSON.parse(stored) : null;
        }
        // есть токен — пробуем получить профиль с сервера.
        try {
            const res = await API.get('/auth/me');
            const me = res?.data ?? null;
            if (me) {
                saveUser(me);
                return me;
            }
        } catch (err) {
            if (err?.response?.status !== 401) console.error('getCurrentUser error', err);
            return null;
        }
    }


    return {
        login,
        register,
        logout,
        getCurrentUser,
        _getAccessToken: getAccessToken,
        _getRefreshToken: getRefreshToken,
    };
})();

export default AuthService;