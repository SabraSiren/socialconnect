import API from "./api";


const AuthService = (() => {

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
        const res = await API.post('/auth/refresh');
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
                        .then(() => {
                            originalRequest._retry = true;
                            return API(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                // начинаем рефреш
                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    await refreshTokenRequest(); // получаем новые токены.
                    processQueue(null);  // разрешаем все ожидающие запросы. без передачи токена.
                    isRefreshing = false;
                    // повторяем оригинальный запрос (куки уже обновились в браузере)
                    return API(originalRequest);
                } catch (err) {
                    // рефреш не удался — выходим из системы.
                    processQueue(err, null);
                    isRefreshing = false;
                    return Promise.reject(err);
                }
            }
        );
    };
    ensureResponseInterceptor();


    async function login({username, password}) {
        try {
            const res = await API.post('/auth/login', {username, password});
            return  res?.data ?? {}; // убрали сохранение токенов. Сервер уже установил куки.
        } catch (err) {
            throw err;
        }
    }


    async function register({username, password, full_name}) {
        try {
            const res = await API.post('/auth/register', {username, password, full_name});
            return  res?.data ?? {};
        } catch (err) {
            throw err;
        }
    }

    async function logout() {
        try {
            // Вызываем API логаута (сервер очистит куки)
            await API.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
            // Все равно считаем, что пользователь вышел
        }
    }

    async function getCurrentUser() {
        // есть токен — пробуем получить профиль с сервера.
        try {
            const res = await API.get('/auth/me');
            return  res?.data ?? null;
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