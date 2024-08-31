import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  generateAccessToken,
  hashPassword,
  validatePassword,
} from 'src/common/helpers/global.helper';
import { UserModel } from 'src/models/entities/User.model';
import { CreateUserDTO, LoginUserDTO } from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async registerUser(payload: CreateUserDTO) {
    try {
      const existingVendor = await UserModel.findOne({
        where: {
          email: payload.email,
        },
      });
      if (existingVendor)
        throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST);
      const hashedPassword = await hashPassword(payload.password);
      await UserModel.create({
        email: payload.email,
        name: payload.name,
        password: hashedPassword,
      });
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'User Created Successfully.',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginUser(payload: LoginUserDTO) {
    try {
      const userExistsorNot = await UserModel.findOne({
        where: {
          email: payload.email,
        },
      });
      if (!userExistsorNot)
        throw new HttpException('User Not Exists', HttpStatus.BAD_REQUEST);
      const passwordCorrect = await validatePassword(
        payload.password,
        userExistsorNot.password,
      );
      if (!passwordCorrect)
        throw new HttpException('Incorrect Password!!', HttpStatus.BAD_REQUEST);
      const accessToken = await generateAccessToken(
        {
          id: userExistsorNot.id,
        },
        this.jwtService,
      );
      return {
        status: true,
        authToken: accessToken,
        message: 'Login Successfull!!',
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
