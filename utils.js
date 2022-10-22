export function get(url) {
  return fetch(url)
    .then(response => response.json());
}

export const API_ROUTES = {
  user_posts: id => `https://jsonplaceholder.typicode.com/posts?userId=${id}`,
  users: 'https://jsonplaceholder.typicode.com/users',
  posts: 'https://jsonplaceholder.typicode.com/posts',
}