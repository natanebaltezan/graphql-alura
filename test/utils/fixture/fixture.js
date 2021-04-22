const Chance = require('chance');

const chance = new Chance();

const roles = [{
  id: chance.hash(),
  type: chance.word()
}];

const createUser = (data = {}) => ({
  id: data.id || chance.hash(),
  name: data.name || chance.name(),
  active: data.active || true,
  email: data.email || chance.email(),
  role: roles[0].id,
  createdAt: data.createdAt | chance.date().toString()
});

module.exports = {
  roles,
  createUser
};

