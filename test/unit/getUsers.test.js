const { assert } = require('chai');
const nocks = require('../utils/nocks');
const Chance = require('chance');
const UsersAPI = require('../../api/user/datasource/user');

describe('GetUsers Tests', () => {
  const usersAPI = new UsersAPI();
  const chance = new Chance();

  const mockRoles = [{
    id: 1,
    type: chance.word()
  }];

  const mockUsers = [
    {
      id: 1,
      name: chance.name(),
      active: true,
      email: chance.email(),
      role: mockRoles[0].id,
      createdAt: chance.date()
    },
    {
      id: 2,
      name: chance.name(),
      active: true,
      email: chance.email(),
      role: mockRoles[0].id,
      createdAt: chance.date()
    }];

  afterEach(() => {
    nocks.cleanAll();
  });

  it('Should return an array of users when the request is correct', async () => {
    const nockGetUsers = nocks.getUsers({ users: mockUsers });
    const nockGetRole = nocks.getRoleById({ roleId: mockUsers[0].role, role: mockRoles[0] })

    const result = await usersAPI.getUsers();

    assert.isArray(result);
    assert.lengthOf(result, mockUsers.length);
    assert.deepEqual(result[0].role, mockRoles[0]);
    assert.isTrue(nockGetUsers.isDone());
    assert.isTrue(nockGetRole.isDone());
  });
});