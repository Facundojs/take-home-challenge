import { TableService, UserService } from './service.js';

const tableService = new TableService(new UserService());

window.tableService = tableService

document.querySelector('#fetchBtn')?.addEventListener('click', async function (e) {
  e.preventDefault();
  await tableService.renderUsers();
})