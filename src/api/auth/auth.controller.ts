import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signupService(createAuthDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  signIn(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.signInService(LoginAuthDto);
  }

  @Post('forget-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async forgetPassword(@Body() updateAuthDto: UpdateAuthDto ) {
    return this.authService.forgetPasswordService(updateAuthDto);
  }

  @Post('send-otp')
  async sendOtp(@Body() body: { email: string }) {
    return this.authService.sendOtpService(body.email);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    return this.authService.resendOtp(body.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string, otp: string }) {
    return this.authService.verifyOtp(body.email, body.otp);
  }

}
