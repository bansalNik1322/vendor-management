import * as bcrypt from 'bcrypt';
import { jwtDecode } from 'jwt-decode';
import { JwtService } from '@nestjs/jwt';
import { HttpException, UnprocessableEntityException } from '@nestjs/common';

export function translateErrors(): UnprocessableEntityException {
  return new HttpException('Something Went Wrong!', 422);
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function validatePassword(
  password: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function generateAccessToken(
  payload: { id: number },
  jwtService: JwtService,
) {
  const token = await jwtService.signAsync(payload, {
    expiresIn: '90d',
    secret: 'thisisoursecret',
  });
  return token;
}

export async function validateToken(token: string, jwtService: JwtService) {
  try {
    await jwtService.verifyAsync(token, { secret: 'thisisoursecret' });
    return true;
  } catch (error) {
    return false;
  }
}

export async function gettingDataFromToken(token: string) {
  try {
    const data = await jwtDecode(token);
    return data;
  } catch (error) {
    return {};
  }
}
