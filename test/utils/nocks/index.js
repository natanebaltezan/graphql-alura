const nock = require('nock');

const nocks = {};
const url = 'http://localhost:3000';

nocks.cleanAll = () => {
  nock.cleanAll();
};

nocks.getUsers = (options = {}) => {
  const path = `/users`;
  if (options.errorMessage) {
    return nock(url)
      .get(path)
      .replyWithError(options.errorMessage);
  }
  return nock(url)
    .get(path)
    .reply(
      options.statusCode || 200,
      options.users
    );
};

nocks.getRoleById = (options = {}) => {
  const path = `/roles/${options.roleId}`;
  if (options.errorMessage) {
    return nock(url)
      .get(path)
      .replyWithError(options.errorMessage);
  }
  return nock(url)
    .get(path)
    .reply(
      options.statusCode || 200,
      options.role
    );
};

nocks.getRoleByType = (options = {}) => {
  const path = `/roles?type=${options.roleType}`;
  if (options.errorMessage) {
    return nock(url)
      .get(path)
      .replyWithError(options.errorMessage);
  }
  return nock(url)
    .get(path)
    .reply(
      options.statusCode || 200,
      options.role
    );
};

nocks.postUser = (options = {}) => {
  const path = '/users';
  if (options.errorMessage) {
    return nock(url)
      .post(path, options.data)
      .replyWithError(options.errorMessage);
  }
  return nock(url)
    .post(path, options.data)
    .reply(
      options.statusCode || 200,
      options.user
    );
};

module.exports = nocks;