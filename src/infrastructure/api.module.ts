import { Module } from '@nestjs/common';
import { ApiController } from '@application/api.controller';
import { PipelineModule } from '@application/pipeline/pipeline.module';
import { ContentModule } from '@application/content/content.module';

@Module({
  imports: [PipelineModule, ContentModule],
  controllers: [ApiController],
})
export class ApiModule {}
