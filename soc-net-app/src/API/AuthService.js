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
    let isRefreshing = false; // флаг: идет ли сейчас обновление токена.
    let failedQueue = []; // { resolve, reject }, очередь запросов, которые ждут обновления токена.

    const processQueue = (error, token = null) => {
        failedQueue.forEach((p) => {
            if (error) p.reject(error); // если ошибка - отклоняем все промисы.
            else p.resolve(token); // если успех - разрешаем все промисы.
        });
        failedQueue = [];  // очищаем очередь.
    };

// Функция, которая попытается обновить токен. Отправляет refresh-токен на сервер, чтобы получить новую пару токенов.
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
            (response) => response, // если все ок - пропускаем ответ.
            async (error) => { // если ошибка - обрабатываем.
                const originalRequest = error.config;

                // Проверка URL
                const isLoginOrRegister =
                    originalRequest.url.includes('/auth/login') ||
                    originalRequest.url.includes('/auth/register');

                // если нет config или это не 401 — просто проброс
                if (!originalRequest || !error.response || error.response.status !== 401 || isLoginOrRegister) {
                    return Promise.reject(error); // не обрабатываем.
                }                  // Если это запрос на логин/регистрацию и там 401 - значит просто неправильный пароль, а не истекший токен.

                if (originalRequest._retry) { // избегаем бесконечных ретраев.
                    return Promise.reject(error);
                }

                // если уже идёт рефреш — ставим этот запрос в очередь и ждём.
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
                    const data = await refreshTokenRequest(); // получаем новые токены.
                    const {access_token: newAccess, refresh_token: newRefresh} = data ?? {};
                    if (!newAccess) return Promise.reject(new Error('No access_token in refresh response'));

                    // сохраняем новые токены и ставим header.
                    saveAccessToken(newAccess);
                    if (newRefresh) saveRefreshToken(newRefresh);

                    processQueue(null, newAccess);  // разрешаем все ожидающие запросы.
                    isRefreshing = false;

                    // повторяем оригинальный запрос с новым токеном
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = 'Bearer ' + newAccess;
                    return API(originalRequest);
                } catch (err) {
                    // рефреш не удался — выходим из системы.
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
            throw err;
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
            throw err;
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
            //  // если нет токена - берем из localStorage.
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
            // пользователь не авторизован = не ошибка.
            return null;
        }
    }


    return {
        login,
        register,
        logout,
        getCurrentUser,
    };
})();

export default AuthService;