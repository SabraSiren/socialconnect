const API_URL = "https://jsonplaceholder.typicode.com";

export async function fetchPosts() {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
        throw new Error("Error loading posts: " + response.status);
    }
    return response.json();
}


export async function fetchPostCommentsById(id) {
    const response = await fetch(`${API_URL}/posts/${id}/comments`);
    if (!response.ok) {
        throw new Error("Error loading comments: " + response.status);
    }
    return response.json();
}


// Получить количество комментариев для поста
export async function fetchCommentsCountByPostId(postId) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}/comments`);
        if (!response.ok) {
            return 0;
        }
        const comments = await response.json();
        return comments.length;
    } catch (error) {
        return 0;
    }
}