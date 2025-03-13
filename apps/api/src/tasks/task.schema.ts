import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'tasks' })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ enum: ['pending', 'completed'], default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
