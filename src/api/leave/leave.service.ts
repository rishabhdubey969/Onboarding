import { Injectable, OnApplicationBootstrap, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { Leave, LeaveDocument } from './entities/leave.entity';
import { LeaveDetail, LeaveDetailDocument } from './entities/leave-details.entity';
import { Auth, AuthenticationDocument } from '../auth/entities/auth.entity';
import {Auth as AuthConst} from 'constant/auth.const';
import { LeaveConst } from 'constant/leave.const';


@Injectable()
export class LeaveService implements OnApplicationBootstrap {

  constructor(
    @InjectModel(Leave.name)
    private leaveModel: Model<LeaveDocument>,
    @InjectModel(Auth.name) private userModel: Model<AuthenticationDocument>,
    @InjectModel(LeaveDetail.name) private leaveDetailModel: Model<LeaveDetailDocument>,
  ) { }

  async onApplicationBootstrap() {
    const existing = await this.leaveModel.find();
    if (existing.length === 0) {
      await this.leaveModel.insertMany(this.staticLeaveJson());
      console.log('Leave types initialized');
    }
  }


  async applyLeaveService(createLeaveDto: CreateLeaveDto, userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException(AuthConst.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Parse and validate leave_date
    const leaveDate = new Date(createLeaveDto.leave_date);
    if (isNaN(leaveDate.getTime())) {
      throw new HttpException(LeaveConst.INVALID_LEAVE_DATE, HttpStatus.BAD_REQUEST);
    }

    // Check if user has already applied for leave on the same day
    const existingLeave = await this.leaveDetailModel.findOne({
      user: userId,
      leave_date: leaveDate,
    });

    if (existingLeave) {
      throw new HttpException(
        LeaveConst.INVALID_SAME_DAY_LEAVE,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if leave application is backdated (more than 3 days ago)
    const today = new Date();
    const diffTime = today.getTime() - leaveDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays > 3) {
      throw new HttpException(
        LeaveConst.INVALID_BACK_DAY_LEAVE,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Apply leave
    const leave = new this.leaveDetailModel({
      ...createLeaveDto,
      user_id: userId,
      leave_date: leaveDate,
    });

    await leave.save();

    return leave;
  }

  getLeavesService(filter, page, limit) {
    const query = this.leaveDetailModel.find(filter);
    const skips = (page - 1) * limit;
    query.skip(skips).limit(limit);
    return query.exec();
  }

  getLeaveByIdService(leaveId: number) {
    return this.leaveModel.findById(leaveId).exec();
  }

  staticLeaveJson() {
    return [{ leave_id: 1, leave_type: "Planned", total_leave: 6 }, { leave_id: 2, leave_type: "Emergency", total_leave: 6 }];
  }
}
