import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UseGuards
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { FilterLeaveDto } from './dto/filter-leave.dto';
import { LeaveConst } from 'constant/leave.const';
import { AuthGuard } from '../../guard/auth.guard';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @UseGuards(AuthGuard)
  applyLeave(@Body() createLeaveDto: CreateLeaveDto, @Req() req: any) {
    return this.leaveService.applyLeaveService(createLeaveDto, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  getLeaves(
    @Query() filter: FilterLeaveDto,
    @Query('page') page: number = LeaveConst.PAGE,
    @Query('limit') limit: number = LeaveConst.LIMIT,
  ) {
    return this.leaveService.getLeavesService(filter, page, limit);
  }

  @Get(':leaveId')
  @UseGuards(AuthGuard)
  getLeaveById(@Param('leaveId') leaveId: string) {
    return this.leaveService.getLeaveByIdService(+leaveId);
  }

}
