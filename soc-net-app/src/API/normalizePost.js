// Утилиты для приведения ответа сервера к единому формату.

export function normalizePost(post) {
    const now = new Date().toISOString();

    if (!post || typeof post !== 'object') {
        return {
            id: Date.now(),
            content: '',
            likes: 0,
            timestamp: now,
            liked_by_user: false
        };
    }

    // Приводим поля к ожидаемым типам/значениям
    const id = post.id ?? Date.now();
    const content = typeof post.content === 'string' ? post.content.trim() : '';
    const likes = Number.isFinite(post.likes) ? Number(post.likes) : (post.likes ? Number(post.likes) || 0 : 0);
    const timestamp = post.timestamp || now;
    const liked_by_user = Boolean(post.liked_by_user ?? false);

    // Возвращаем normalized объект, сохраняя прочие поля (если они есть)
    return {
        id,
        content,
        likes,
        timestamp,
        liked_by_user,
        ...post,
    };
}

export function normalizePostsArray(list) {
    if (!Array.isArray(list)) return [];
    return list.map(normalizePost);
}
