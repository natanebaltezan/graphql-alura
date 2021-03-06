const { RESTDataSource } = require('apollo-datasource-rest');
const { success, notFound, created, internalServerError } = require('../../utils/queryStatus');

class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3000';
    this.initialize({});
  };

  async getUsers() {
    const getUsers = await this.get('/users');

    const users = await Promise.all(getUsers.map(async user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      role: await this.get(`/roles/${user.role}`)
    })));
    return users;
  };

  async getUserById(id) {
    try {
      const user = await this.get(`/users/${id}`);
      if (!user) {
        return notFound(`Não foi encontrado nenhum usuário com id ${id}`);
      }
      const role = await this.get(`/roles/${user.role}`);
      user.role = role.id;
      const result = success('Operação realizada com sucesso.');
      return (
        {
          ...result,
          user
        });
    } catch (error) {
      return internalServerError(error.message);
    }
  };

  async addUser(user) {
    try {
      const users = await this.get('/users');
      const role = await this.get(`roles?type=${user.role}`);
      const createdUser = await this.post('/users', { ...user, role: role[0].id });
      if (!users.length) {
        user.id = 1;
      } else {
        user.id = users.length + 1;
      }
      const response = created(`Usuário ${createdUser.id} criado com sucesso.`);
      return ({
        ...response,
        user: {
          ...createdUser,
          role: role[0].id
        }
      });
    } catch (error) {
      return internalServerError(error.message);
    }
  };

  async updateUser(newData) {
    try {
      const role = await this.get(`roles?type=${newData.user.role}`);
      const updatedUser = await this.put(`users/${newData.id}`, { ...newData.user, role: role[0].id });
      const result = success(`Usuário ${updatedUser.id} foi atualizado.`);
      return ({
        ...result,
        user: {
          ...updatedUser,
          role: role[0]
        }
      });
    } catch (error) {
      return internalServerError(error.message);
    }
  };

  async deleteUser(id) {
    try {
      await this.delete(`users/${id}`);
      return success(`Usuário ${id} deletado.`);
    } catch (error) {
      return internalServerError(error.message);
    }
  };
};

module.exports = UsersAPI;