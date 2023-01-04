import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import HttpException from '../../utils/exceptions/http.exception';
import validate from './user.validation';
import UserService from './user.service';
import authenticated from '../../middleware/authenticate.middleware';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
    this.router.post(`${this.path}`, authenticated, this.getUser);
  }

  /**
   * register controller
   */
  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, email, password } = req.body;
      const token = await this.UserService.register(
        name,
        email,
        password,
        'user'
      );

      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**
   * login controller
   */
  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.UserService.login(email, password);

      res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  /**
   * Get User
   */
  private getUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (!req.user) return next(new HttpException(404, 'User not logged in!'));

    res.status(200).json({ user: req.user });
  };
}

export default UserController;
