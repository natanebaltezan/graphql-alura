const QueryStatus = {
  success: 'SUCCESS',
  created: 'CREATED',
  notFound: 'NOT_FOUND',
  internalServerError: 'ERROR'
};

const success = (message) => ({ status: QueryStatus.success, message });
const created = (message) => ({ status: QueryStatus.created, message });
const notFound = (message) => ({ status: QueryStatus.notFound, message });
const internalServerError = (message) => ({ status: QueryStatus.internalServerError, message });

module.exports = {
  success,
  created,
  notFound,
  internalServerError
};