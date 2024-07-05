import { ContentService } from '@domain/content/services/content.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';

@Module({
  imports: [HttpModule],
  providers: [ContentService],
  controllers: [ContentController],
  exports: [ContentService],
})
export class ContentModule {}
