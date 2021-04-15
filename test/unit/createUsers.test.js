const { assert } = require('chai');
const nock = require('nock');
const Chance = require('chance');
const UsersAPI = require('../../api/user/datasource/user');

describe('User service tests', () => {
  const usersAPI = new UsersAPI();
  const chance = new Chance();
  const url = 'http://localhost:3000';

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
    nock.cleanAll();
  });

  it('Should create an user when body is correct', async () => {
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

    nock(url)
      .get('/users')
      .reply(
        200,
        mockUsers
      );

    nock(url)
      .get(`/roles?type=${mockRoles[0].type}`)
      .reply(
        200,
        mockRoles
      );

    nock(url)
      .post('/users', { ...body, role: mockRoles[0].id })
      .reply(
        200,
        expectedUser
      );

    const result = await usersAPI.addUser(body);

    assert.strictEqual(result.user.name, expectedUser.name);
    assert.strictEqual(result.user.active, expectedUser.active);
    assert.strictEqual(result.user.email, expectedUser.email);
    assert.strictEqual(result.user.createdAt, expectedUser.createdAt);
    assert.strictEqual(result.user.id, expectedUser.id);
    assert.strictEqual(result.user.role, expectedUser.role);
    assert.isTrue(nock.isDone());
  });
});