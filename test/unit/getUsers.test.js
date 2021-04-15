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

  it('Should return an array of users when getUsers is called', async () => {
    nock(url)
      .get('/users')
      .reply(
        200,
        mockUsers
      );

    nock(url)
      .get(`/roles/${mockUsers[0].role}`)
      .reply(
        200,
        mockRoles[0]
      );

    const result = await usersAPI.getUsers();

    assert.isArray(result);
    assert.lengthOf(result, mockUsers.length);
    assert.deepEqual(result[0].role, mockRoles[0]);
    assert.isTrue(nock.isDone());
  });
});