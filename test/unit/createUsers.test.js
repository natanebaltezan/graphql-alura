const { assert } = require('chai');
const nocks = require('../utils/nocks');
const Chance = require('chance');
const UsersAPI = require('../../api/user/datasource/user');

describe('CreateUsers Tests', () => {
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
    }];

  afterEach(() => {
    nocks.cleanAll();
  });

  it('Should return an user when the request is correct', async () => {
    const body = {
      name: chance.name(),
      active: true,
      email: chance.email(),
      role: mockRoles[0].type,
      createdAt: chance.date().toISOString()
    };

    const expectedUser = {
      ...body,
      role: mockRoles[0].id,
      id: mockUsers.length + 1
    };

    const nockGetUsers = nocks.getUsers({ users: mockUsers });
    const nockGetRoles = nocks.getRoleByType({ roleType: body.role, role: mockRoles });
    const nockPostUser = nocks.postUser({ data: { ...body, role: mockRoles[0].id }, user: expectedUser })

    const result = await usersAPI.addUser(body);
    assert.deepEqual(result.user, expectedUser);
    assert.isTrue(nockGetUsers.isDone());
    assert.isTrue(nockGetRoles.isDone());
    assert.isTrue(nockPostUser.isDone());
  });
});