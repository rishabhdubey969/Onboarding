import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtConstant } from '../../jwt_security/jwt.const';
import { Auth } from 'constant/auth.const';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization as string;
    const parts = authorizationHeader.split(' ');
    const token = parts[1];

    try {
      const decoded = jwt.verify(token, JwtConstant.secret);
      (req as any).user = decoded;
      next();
    } catch (error) {
      throw new HttpException(Auth.INVALID_AUTH_FORMAT, HttpStatus.FORBIDDEN);
    }
  }
}
