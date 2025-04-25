import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './entities/profile.entity';
import { Model, isValidObjectId } from 'mongoose';
import { Profile as ProfileConst } from 'constant/profile.const';
import { Auth } from 'constant/auth.const';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) { }

  async profileCreateService(createProfileDto: CreateProfileDto, userId) {
    const createProfileData = {
      ...createProfileDto,
      user_id: userId,
    };

    const createdUserProfile = new this.profileModel(createProfileData);
    return await createdUserProfile.save();
  }

  async profileGetService(userId) {

    if (!isValidObjectId(userId)) {
      throw new BadRequestException(ProfileConst.INVALID_ID);
    }

    const existingProfileCheck = await this.profileModel
      .findOne({ user_id: userId })
      .exec();

    if (!existingProfileCheck) {
      throw new HttpException(ProfileConst.NOT_FOUND, HttpStatus.FORBIDDEN);
    }
    return existingProfileCheck;
  }


  async profileUpdateService(userId, UpdateProfileDto: UpdateProfileDto) {
    const existingProfileCheck = await this.profileModel
      .findOne({ user_id: userId })
      .exec();

    if (!existingProfileCheck) {
      throw new HttpException(ProfileConst.NOT_FOUND, HttpStatus.FORBIDDEN);
    }

    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { user_id: userId }, // Find the profile by userId
      { $set: UpdateProfileDto }, // Update with the data from UpdateProfileDto
      { new: true }, // Return the updated document
    ).exec();

    if (!updatedProfile) {
      throw new HttpException(ProfileConst.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return updatedProfile;


  }

}
