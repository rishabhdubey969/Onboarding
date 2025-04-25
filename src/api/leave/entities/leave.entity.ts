import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DataBaseConst } from '../../../../database/mongo.const';

// Mongoose schema document interface
export type LeaveDocument = Leave & Document;

@Schema({ _id: false , collection: DataBaseConst.LEAVE_BUCKET, timestamps: true })
export class Leave {
    
  @Prop({ required: true })
  leave_id: number;

  @Prop({ required: true })
  leave_type: string;

  @Prop({ required: true })
  total_leave: number;

}

// Create the Mongoose schema
export const LeaveSchema = SchemaFactory.createForClass(Leave);
