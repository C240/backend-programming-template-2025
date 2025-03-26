const AuthenticationController = require('./authentication-controller');

module.exports = (app) => {
  const controller = new AuthenticationController();

  app.post('/authentication/login', controller.login);
};
