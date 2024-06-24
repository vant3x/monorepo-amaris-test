import { Module, Global } from '@nestjs/common';
import {  DatabaseModule } from '../infrastructure/database/database.module';

@Global()
@Module({
  imports: [ DatabaseModule],
  exports: [DatabaseModule],
})
export class SharedModule {}