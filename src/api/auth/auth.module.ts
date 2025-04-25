import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthenticationSchema } from './entities/auth.entity';
import { Leave, LeaveSchema } from '../leave/entities/leave.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthenticationSchema }, { name: Leave.name, schema: LeaveSchema }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
