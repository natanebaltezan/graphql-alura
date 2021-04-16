const Chance = require('chance');

const chance = new Chance();

const createRole = () => ([{
  id: chance.hash(),
  type: chance.word()
}]);

const userRole = createRole();

const createUser = (data = {}) => ({
  id: data.id || chance.hash(),
  name: data.name || chance.name(),
  active: data.active || true,
  email: data.email || chance.email(),
  role: userRole[0].id,
  createdAt: data.createdAt | chance.date().toString()
});

module.exports = {
  createRole,
  createUser
};

