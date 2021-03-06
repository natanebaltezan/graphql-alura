const { GraphQLScalarType } = require('graphql');

const userResolvers = {
  RolesType: {
    STUDENT: "ESTUDANTE",
    TEACHER: "DOCENTE",
    COORDINATION: "COORDENACAO"
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'string de data e hora no formato ISO-8601',
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value),
    parseLiteral: (ast) => new Date(ast.value)
  }),
  Query: {
    getUsers: (root, args, { dataSources }) => dataSources.usersAPI.getUsers(),
    getUserById: (root, { id }, { dataSources }) => dataSources.usersAPI.getUserById(id)
  },
  Mutation: {
    addUser: async (root, { user }, { dataSources }) => dataSources.usersAPI.addUser(user),
    updateUser: async (root, newData, { dataSources }) => dataSources.usersAPI.updateUser(newData),
    deleteUser: async (root, { id }, { dataSources }) => dataSources.usersAPI.deleteUser(id)
  }
};

module.exports = userResolvers;