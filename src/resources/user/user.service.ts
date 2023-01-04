import UserModel from './user.model';
import token from '../../utils/token';

class UserService {
  private User = UserModel;

  /**
   * register new user
   */

  public async register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<string | Error> {
    try {
      const user = await this.User.create({ name, email, password, role });
      const accessToken = token.createToken(user);
      return accessToken;
    } catch (error) {
      throw new Error('Unable to register new user!');
    }
  }

  /**
   * Login User
   */
  public async login(email: string, password: string): Promise<string | Error> {
    try {
      const user = await this.User.findOne({ email });

      if (!user) throw new Error('Cannot find any user with this email!');

      if (await user.isValidPassword(password)) {
        return token.createToken(user);
      } else {
        throw new Error('Wrong Credentials!');
      }
    } catch (error) {
      throw new Error('Unable to login new user!');
    }
  }
}

export default UserService;
