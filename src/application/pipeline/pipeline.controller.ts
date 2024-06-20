import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePipelineDto } from "./dto/pipeline.dto";
import { PipelineService } from "@domain/pipeline/services/pipeline.service";

@Controller('pipeline')
@ApiTags('pipeline')
export class PipelineController {
    constructor(private readonly pipelineService: PipelineService) { }

    @Post('execute')
    @ApiResponse({ status: 200, type: Object })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBody({ type: CreatePipelineDto })
    async executePipeline(@Body() createPipelineDto: CreatePipelineDto) {
        try {
            return await this.pipelineService.executePipeline(createPipelineDto);
        } catch (error) {
            throw new HttpException(error.response.data, error.response.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}