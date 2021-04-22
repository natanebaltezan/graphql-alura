const { assert } = require('chai');
const nocks = require('../utils/nocks');
const { roles, createUser } = require('../utils/fixture/fixture');
const UsersAPI = require('../../api/user/datasource/user');

const usersAPI = new UsersAPI();

describe('Get Users', () => {
  const mockRole = roles;
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

describe('Get user by Id', () => {
  const mockRole = roles;
  const mockUsers = [
    createUser()
  ];

  afterEach(() => {
    nocks.cleanAll();
  });

  it('Should return a user when the request is correct', async () => {
    const nockGetUser = nocks.getUser({ userId: mockUsers[0].id, user: mockUsers[0] });
    const nockGetRole = nocks.getRoleById({ roleId: mockUsers[0].role, role: mockRole[0] });

    const result = await usersAPI.getUserById(mockUsers[0].id);

    assert.isObject(result.user);
    assert.deepEqual(result.user, mockUsers[0]);
    nocks.cleanAll();
    assert.isTrue(nockGetUser.isDone());
    assert.isTrue(nockGetRole.isDone());
  });
});