import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../../guard/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseGuards(AuthGuard)
  profileCreate(@Body() createProfileDto: CreateProfileDto, @Req() req: any) {
    const userId = req.user.id;
    return this.profileService.profileCreateService(createProfileDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  profileGet(@Req() req: any) {
    return this.profileService.profileGetService(req.user.id);
  }


  @Patch()
  @UseGuards(AuthGuard)
  profileUpdate(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.profileUpdateService(req.user.id, updateProfileDto);
  }


}
