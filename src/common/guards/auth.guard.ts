// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/models/entities/User.model';
import { gettingDataFromToken, validateToken } from '../helpers/global.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(
        'No authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorizationHeader.split('Bearer ')[1];
    if (!token) {
      throw new HttpException('No token', HttpStatus.UNAUTHORIZED);
    }

    const isTokenValid = await validateToken(token, this.jwtService);

    if (!isTokenValid) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    const { id } = (await gettingDataFromToken(token)) as { id: number };
    if (!id) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new HttpException(
        'No user found, Invalid Token',
        HttpStatus.UNAUTHORIZED,
      );
    }
    request.userID = id;
    return Promise.resolve(true);
  }
}
