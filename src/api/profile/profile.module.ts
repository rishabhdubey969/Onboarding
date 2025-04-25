import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthMiddleware } from 'src/middleware/auth.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfileSchema, Profile } from './entities/profile.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: UserProfileSchema },
    ]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProfileController);
  }
}
