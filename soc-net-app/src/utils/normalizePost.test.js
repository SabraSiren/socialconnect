import { normalizePost, normalizePostsArray } from './normalizePost';

test('normalizePost возвращает объект с обязательными полями', () => {
    const result = normalizePost({});

    // Проверяем что все поля есть
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('likes');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('liked_by_user');
});

test('normalizePost обрабатывает undefined', () => {
    const result = normalizePost();
    expect(result.content).toBe('');
    expect(result.likes).toBe(0);
});

test('normalizePostsArray обрабатывает пустой массив', () => {
    const result = normalizePostsArray([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
});

test('normalizePost сохраняет дополнительные поля', () => {
    const post = {
        id: 123,
        content: 'Пост',
        author: { name: 'Автор' },
        custom_field: 'значение'
    };

    const result = normalizePost(post);

    expect(result.id).toBe(123);
    expect(result.content).toBe('Пост');
    expect(result.author).toEqual({ name: 'Автор' });
    expect(result.custom_field).toBe('значение');
});

