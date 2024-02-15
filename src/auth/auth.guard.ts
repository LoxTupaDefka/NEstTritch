import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const token = req.cookies[CookieService.tokenKey];
    console.log('ReqCoo', req.cookies);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const sessionInfo = this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('SESSIONGUADRINFO', sessionInfo);
      req['session'] = sessionInfo;
    } catch (error) {
      console.log("errrorr token guard")
      throw new UnauthorizedException();
    }
    return true;
  }
}
