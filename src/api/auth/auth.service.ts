import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthenticationDocument, Auth } from './entities/auth.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Auth as AuthConst } from '../../../constant/auth.const';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Leave, LeaveDocument } from '../leave/entities/leave.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as redis from 'redis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { sendMail } from 'src/services/mail.services';
import { UpdateAuthDto } from './dto/update-auth.dto';




@Injectable()
export class AuthService {

  private redisClient: redis.RedisClientType;

  constructor(
    @InjectModel(Auth.name)
    private authenticationModel: Model<AuthenticationDocument>,
    @InjectModel(Leave.name)
    private leaveModel: Model<LeaveDocument>,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger
  ) {
    // Initialize Redis client
    this.redisClient = redis.createClient({
      url: process.env.REDIS,
    });

    this.redisClient.connect(); // Connect to Redis server
  }

  /**
   * @param createAuthDto 
   * @returns user created data.
   */
  async signupService(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const existingAuthenticationLogin = await this.authenticationModel
      .findOne({ email })
      .exec();

    if (existingAuthenticationLogin) {
      throw new HttpException(AuthConst.EMAIL_NOT_FOUND, HttpStatus.FORBIDDEN);
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdAuthentication = new this.authenticationModel({
      ...createAuthDto,
      password: hashedPassword
    });
    await createdAuthentication.save();

    // Optionally, you can remove password from the response for security reasons
    const { password: string, ...userWithoutPassword } = createdAuthentication.toObject();

    this.logger.info('user store success');
    return userWithoutPassword;
  }

  /**
   * 
   * @param LoginAuthDto 
   * @returns jwt return token.
   */
  async signInService(LoginAuthDto: LoginAuthDto) {
    const { email } = LoginAuthDto;
    const { password } = LoginAuthDto;
    const existingAuthenticationLogin = await this.authenticateUser(email);

    const isPasswordValid = await bcrypt.compare(password, existingAuthenticationLogin.password);

    if (!isPasswordValid) {
      throw new HttpException(AuthConst.PASSWORD_NOT_FOUND, HttpStatus.FORBIDDEN);
    }

    const payload = {
      id: existingAuthenticationLogin._id,
      email: existingAuthenticationLogin.email,
    };
    this.logger.info('token store success');
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * 
   * @param email 
   * @returns send mail with otp
   */
  async sendOtpService(email: string): Promise<any> {
    await this.authenticateUser(email);
    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex');

    // Store OTP in Redis with 5-minute expiration
    await this.redisClient.set(`otp:${email}`, otp, { EX: 300 }); // Expiry time 5 minutes

    await sendMail(email, 'Password Reset OTP', `Your OTP is ${otp}`);

    //await transporter.sendMail(mailOptions);
    return { message: AuthConst.OTP_SENT };
  }

  /**
   * 
   * @param email 
   * @param newPassword 
   * @returns 
   */
  async forgetPasswordService(updateAuthDto) {
    const { email } = updateAuthDto;
    const { password } = updateAuthDto;
    await this.authenticateUser(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.authenticationModel.updateOne({ email }, { password: hashedPassword });
    return { message: AuthConst.PASSWORD_REST };
  }

  /**
   * 
   * @param email 
   * @returns send mail with new otp
   */
  async resendOtp(email: string): Promise<any> {
    const otp = crypto.randomBytes(3).toString('hex');

    // Store new OTP in Redis with a 10-minute expiration
    await this.redisClient.set(`otp:${email}`, otp, { EX: 300 });

    await sendMail(email, 'Resend OTP', `Your new OTP is ${otp}`);
    return { message: AuthConst.NEW_OTP_SENT };
  }

  /**
   * 
   * @param email 
   * @param otp 
   * @returns checking otp is valid or not
   */
  async verifyOtp(email: string, otp: string): Promise<any> {
    const storedOtp = await this.redisClient.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new Error(AuthConst.INVALID_OTP);
    }

    // OTP is correct, activate the account
    const user = await this.authenticateUser(email);

    user.isVerified = true;
    await user.save();

    // Remove OTP from Redis after successful verification
    await this.redisClient.del(`otp:${email}`);

    return { message: AuthConst.OTP_VERIFIED };
  }


  async logout(userId: string): Promise<any> {
    await this.redisClient.del(userId); // Remove the session from Redis
    return { message: AuthConst.LOGOUT };
  }


  async authenticateUser(email: string) {
    const existingAuthenticationLogin = await this.authenticationModel
      .findOne({ email })
      .exec();

    if (!existingAuthenticationLogin) {
      throw new HttpException(AuthConst.EMAIL_NOT_FOUND, HttpStatus.FORBIDDEN);
    }
    return existingAuthenticationLogin;
  }
}
