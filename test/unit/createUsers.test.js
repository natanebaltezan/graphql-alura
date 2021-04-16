const { assert } = require('chai');
const nocks = require('../utils/nocks');
const { createRole, createUser } = require('../utils/fixture/fixture');
const Chance = require('chance');
const UsersAPI = require('../../api/user/datasource/user');

const usersAPI = new UsersAPI();
const chance = new Chance();
describe('CreateUsers Tests', () => {
  const mockRole = createRole();
  const mockUsers = [
    createUser(),
    createUser()
  ];

  afterEach(() => {
    nocks.cleanAll();
  });

  it('Should return an user when the request is correct', async () => {
    const body = {
      name: chance.name(),
      active: true,
      email: chance.email(),
      role: mockRole[0].type,
      createdAt: chance.date().toISOString()
    };

    const expectedUser = {
      ...body,
      role: mockRole[0].id,
      id: mockUsers.length + 1
    };

    const nockGetUsers = nocks.getUsers({ users: mockUsers });
    const nockGetRoles = nocks.getRoleByType({ roleType: body.role, role: mockRole });
    const nockPostUser = nocks.postUser({ data: { ...body, role: mockRole[0].id }, user: expectedUser })

    const result = await usersAPI.addUser(body);
    assert.deepEqual(result.user, expectedUser);
    assert.isTrue(nockGetUsers.isDone());
    assert.isTrue(nockGetRoles.isDone());
    assert.isTrue(nockPostUser.isDone());
  });
});