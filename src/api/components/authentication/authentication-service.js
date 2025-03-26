const { Users } = require('../../../models');
const { comparePassword } = require('../../../utils/password');

class AuthenticationService {
  async login(email, password) {
    const user = await Users.findOne({ email });

    if (!user) {
      return false;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    return isPasswordValid;
  }
}

module.exports = AuthenticationService;
