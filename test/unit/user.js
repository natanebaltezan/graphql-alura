const { assert } = require('chai');
const nock = require('nock');
const sinon = require('sinon');
const Chance = require('chance');
const UsersAPI = require('../../api/user/datasource/user');
const apolloServer = require('./../../api/index');
const sandbox = sinon.createSandbox();

const {
  success,
  notFound,
  created,
  internalServerError
} = require('../../api/utils/queryStatus');

let app;

describe('User service tests - Get Users', () => {
  const usersAPI = new UsersAPI();
  const chance = new Chance();
  const nocks = {};
  const url = 'http://localhost:3000';

  const mockUsers = [
    {
      "id": 1,
      "name": "Ana Torre",
      "active": true,
      "email": "a@a.com",
      "role": 1
    }]

  const mockRoles = [{
    id: 1,
    type: chance.word()
  }];

  const body = {
    name: chance.name(),
    active: true,
    email: chance.email(),
    role: mockRoles[0].type,
    createdAt: "2021-02-26T00:00:00.000Z"
  };


  it('Should create an user when body is correct', async () => {
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
        {
          user: {
            ...body,
            role: mockRoles[0].id
          }
        }
      );

    await usersAPI.addUser(body);

    assert.strictEqual(body.name, expectedUser.name);
    assert.strictEqual(body.active, expectedUser.active);
    assert.strictEqual(body.email, expectedUser.email);
    assert.strictEqual(body.createdAt, expectedUser.createdAt);
    assert.strictEqual(body.id, expectedUser.id);
    assert.strictEqual(mockRoles[0].id, expectedUser.role);
    assert.isTrue(nock.isDone());
  });
});