import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../resources/user/user.model';
import Token from '../utils/interfaces/token.interface';
import HttpException from '../utils/exceptions/http.exception';
import { verifyToken } from '../utils/token';

async function authenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer'))
    return res.status(401).json({ error: 'Unauthorized!' });

  const accessToken = bearer.split('Bearer: ')[1].trim();

  try {
    const payload: Token | jwt.JsonWebTokenError = await verifyToken(
      accessToken
    );
    if (payload instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Unauthorized!' });
    }

    const user = await UserModel.findById(payload.id)
      .select('-password')
      .exec();
    if (!user) return next(new HttpException(401, 'Unauthorized!'));

    req.user = user;
    return next();
  } catch (e) {
    return next(new HttpException(401, 'Unauthorized!'));
  }
}

export default authenticatedMiddleware;
