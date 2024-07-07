import { ContentService } from '@domain/content/services/content.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SavePipelineDTO } from './dto/save.pipeline.dto';
import { Pipeline } from '@application/pipeline/dto/pipeline.dto';

@Controller('pipeline')
@ApiTags('pipeline')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('save')
  @ApiResponse({ status: 200, type: Pipeline })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiBody({ type: SavePipelineDTO })
  async savePipelineToMicroservice(@Body() savePipelineDTO: SavePipelineDTO) {
    return await this.contentService.savePipelineToMicroservice(
      savePipelineDTO,
    );
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Pipeline })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({ name: 'id', type: String })
  async getPipelineFromMicroserviceById(@Param('id') id: string) {
    return await this.contentService.getPipelineFromMicroservice(id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: Pipeline })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({ name: 'id', type: String })
  async deletePipelineFromMicroserviceById(@Param('id') id: string) {
    return await this.contentService.deletePipelineFromMicroservice(id);
  }

  @Get('list')
  @ApiResponse({ status: 200, type: [Pipeline] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getPipelineListFromMicroservice() {
    return await this.contentService.getPipelineListFromMicroservice();
  }

  @Get('owner/:ownerId')
  @ApiResponse({ status: 200, type: [Pipeline] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({ name: 'ownerId', type: String })
  async getPipelineListFromMicroserviceByOwner(
    @Param('ownerId') ownerId: string,
  ) {
    return await this.contentService.getOwnerPipelineListFromMicroservice(
      ownerId,
    );
  }
}
