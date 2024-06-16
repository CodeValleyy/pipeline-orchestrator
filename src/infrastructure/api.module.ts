import { Module } from '@nestjs/common';
import { ApiController } from '@application/api.controller';
import { PipelineModule } from '@application/pipeline/pipeline.module';

@Module({
    imports: [
        PipelineModule
    ],
    controllers: [ApiController],
})
export class ApiModule { }
