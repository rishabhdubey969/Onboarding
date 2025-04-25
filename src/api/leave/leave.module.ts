import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Leave, LeaveSchema } from './entities/leave.entity';
import { Auth, AuthenticationSchema } from '../auth/entities/auth.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { LeaveDetail, LeaveDetailSchema } from './entities/leave-details.entity';

@Module({
  imports:[MongooseModule.forFeature([{ name: Leave.name, schema: LeaveSchema }, { name: Auth.name, schema: AuthenticationSchema }, { name: LeaveDetail.name, schema: LeaveDetailSchema }])],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(LeaveController);
  }
}
