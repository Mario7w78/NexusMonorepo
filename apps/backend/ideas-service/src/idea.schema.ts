// apps/backend/ideas-service/src/idea.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IdeaDocument = HydratedDocument<Idea>;

@Schema()
export class Idea {
  @Prop() title: string;
  @Prop() description: string;
  @Prop() budget: string;
  @Prop() author: string; // Nombre simple por ahora
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);