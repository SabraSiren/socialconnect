// utils/errorHandler.js

// Преобразует технические ошибки в понятные пользователю сообщения.
export const getFriendlyErrorMessage = (error) => {
    // Если это уже дружелюбное сообщение - возвращаем как есть
    if (typeof error === 'string' && !error.includes('status code') && !error.includes('Network Error')) {
        return error;
    }

    // Обработка http ошибок.
    if (error?.response?.status) {
        switch (error.response.status) {
            case 400:
                return 'Invalid request. Please check your data.';
            case 401:
                return 'Please log in to continue.';
            case 403:
                return 'You do not have permission for this action.';
            case 404:
                return 'Resource not found.';
            case 409:
                return 'This resource already exists.';
            case 422:
                return 'Validation error. Please check your input.';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Server error. Please try again later.';
            case 502:
                return 'Service temporarily unavailable.';
            case 503:
                return 'Service unavailable. Please try again later.';
            default:
                return 'Something went wrong. Please try again.';
        }
    }

    // Обработка сетевых ошибок.
    if (error?.message) {
        if (error.message.includes('Network Error')) {
            return 'Network connection failed. Please check your internet connection.';
        }
        if (error.message.includes('timeout')) {
            return 'Request timeout. Please try again.';
        }
    }

    // Обработка специфичных ошибок из сообщений.
    if (typeof error?.message === 'string') {
        const message = error.message.toLowerCase();

        if (message.includes('username') && message.includes('already exists')) {
            return 'This username is already taken. Please choose another one.';
        }
        if (message.includes('password')) {
            return 'Invalid password. Please try again.';
        }
        if (message.includes('email')) {
            return 'Please enter a valid email address.';
        }
    }

    // Дефолтное сообщение.
    return 'Something went wrong. Please try again.';
};