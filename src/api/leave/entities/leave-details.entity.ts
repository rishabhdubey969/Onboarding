import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DataBaseConst } from '../../../../database/mongo.const';

// Mongoose schema document interface
export type LeaveDetailDocument = LeaveDetail & Document;

@Schema({ collection: DataBaseConst.LEAVE, timestamps: true })
export class LeaveDetail {
    
  @Prop({ required: true })
  leave_id: string;

  @Prop({ required: true })
  leave_type: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  leave_date: Date;

  // @Prop({ required: true })
  // end_date: Date;

  @Prop({ required: true })
  remark: string;

  @Prop({ required: true, maxlength: 500  })
  reason: string;

  // @Prop({ default: false })
  // approved: boolean;

}

// Create the Mongoose schema
export const LeaveDetailSchema = SchemaFactory.createForClass(LeaveDetail);
