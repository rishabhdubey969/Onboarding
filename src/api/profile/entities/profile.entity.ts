import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DataBaseConst } from '../../../../database/mongo.const';

@Schema({ collection: DataBaseConst.USER_PROFILE, timestamps: true })
export class Profile extends Document {
  @Prop({ required: true, type: Types.ObjectId })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  date_of_birth: Date;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  material_status: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  image: string;
}

// Create the Mongoose schema
export const UserProfileSchema = SchemaFactory.createForClass(Profile);
