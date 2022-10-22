import { get, API_ROUTES } from './utils.js'

export class UserService {
  #users = [];

  get userList() {
    return this.#users;
  }

  getUser(id) {
    return this.#users.find(user => user.id === id);
  }

  async fetchUsers() {
    const users = await get(API_ROUTES.users);
    this.#users = users;
    return this.userList;
  }

  async getUserPosts(id) {
    const user = this.getUser(id);
    let posts = [];
    if (!user.posts) {
      const url = API_ROUTES.user_posts(id);

      posts = await get(url);
      this.#updateUser(id, posts);
    }
    return posts;
  }

  #updateUser(id, data) {
    const userIndex = this.#users.findIndex(user => user.id === id);
    const user = this.#users[userIndex];
    this.#users[userIndex] = Object.assign(user, data);
  }
}

export class TableService {
  #dialogContent = document.querySelector('#dcontent');
  #headerdata = document.querySelector('#headerdata');
  #dialog = document.querySelector('#postsModal');
  #userService = null;
  #rendered = false;

  constructor(userService) {
    this.#userService = userService;
    document
      .querySelector('#closeModalBtn')
      .addEventListener(
        'click',
        () => this.#dialog.close()
      )
  }

  async renderUsers() {
    if (this.#rendered) return;
    this.#toggleLoader();

    const table = document.querySelector('#table');

    await this.#userService.fetchUsers();

    const rows = this.#userService.userList.map(user => this.#getUserRow(user.id));
    table.innerHTML += rows.join('');
    this.#rendered = true;
    document.querySelector('#fetchBtn').disabled = true;
    this.#toggleLoader();
  }

  async renderUserPosts(id) {
    const posts = await this.#userService.getUserPosts(id);
    const postRows = posts.map(post => this.#getPostHTML(post));
    const user = this.#userService.getUser(id);

    this.#headerdata.innerHTML = `${user.name}'s posts`;
    this.#dialogContent.innerHTML = postRows.join('');
    this.#dialog.showModal();
  }

  #toggleLoader() {
    const loader = document.querySelector('#loader');
    loader.classList.toggle('loader');
  }

  #getPostHTML(post) {
    return `<div class="post">
      <h3>${post.title}</h3>
      <p>${post.body}</p>
    </div>`
  }

  #getUserRow(id) {
    const user = this.#userService.getUser(id);

    return `<tr>
    <td>${user.id}</td>
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.website}</td>
    <td><button id="btnPost${user.id}" onclick="tableService.renderUserPosts(${user.id})">Show posts</button></td>
  </tr>`
  }
}