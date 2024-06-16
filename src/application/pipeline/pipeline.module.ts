import { PipelineController } from './pipeline.controller';
import { PipelineService } from './../../domain/pipeline/services/pipeline.service';
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    controllers: [PipelineController],
    providers: [PipelineService],
})
export class PipelineModule { }
