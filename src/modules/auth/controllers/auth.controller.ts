import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDTO, LoginUserDTO } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() payload: LoginUserDTO) {
    return this._authService.loginUser(payload);
  }

  @Post('/register')
  async createUser(@Body() payload: CreateUserDTO) {
    const getData = await this._authService.registerUser(payload);
    return getData;
  }
}
