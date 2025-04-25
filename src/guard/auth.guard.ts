import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth } from '../../constant/auth.const';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new HttpException(Auth.AUTH_HEADER_MISSING, HttpStatus.FORBIDDEN);
    }

    const parts = authorizationHeader.split(' ');

    // Check if the token starts with 'Bearer'
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpException(Auth.INVALID_AUTH_HEADER, HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
