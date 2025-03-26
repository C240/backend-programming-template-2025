const AuthenticationService = require('./authentication-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

class AuthenticationController {
  constructor() {
    this.service = new AuthenticationService();
  }

  login = async (request, response, next) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        throw errorResponder(
          errorTypes.INVALID_INPUT,
          'Email and password are required'
        );
      }

      const result = await this.service.login(email, password);

      if (!result) {
        throw errorResponder(
          errorTypes.INVALID_PASSWORD,
          'Invalid email or password'
        );
      }

      return response.json({
        success: true,
        message: 'Login successful',
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = AuthenticationController;
