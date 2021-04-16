const { assert } = require('chai');
const nocks = require('../utils/nocks');
const { createRole, createUser } = require('../utils/fixture/fixture');
const UsersAPI = require('../../api/user/datasource/user');

const usersAPI = new UsersAPI();

describe('GetUsers Tests', () => {
  const mockRole = createRole();
  const mockUsers = [
    createUser(),
    createUser(),
    createUser()
  ];

  afterEach(() => {
    nocks.cleanAll();
  });

  it('Should return an array of users when the request is correct', async () => {
    const nockGetUsers = nocks.getUsers({ users: mockUsers });
    const nockGetRole = nocks.getRoleById({ roleId: mockUsers[0].role, role: mockRole[0] });

    const result = await usersAPI.getUsers();

    assert.isArray(result);
    assert.lengthOf(result, mockUsers.length);
    assert.deepEqual(result[0].role, mockRole[0]);
    assert.isTrue(nockGetUsers.isDone());
    assert.isTrue(nockGetRole.isDone());
  });
});