import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
