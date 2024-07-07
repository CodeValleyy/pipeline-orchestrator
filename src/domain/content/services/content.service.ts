import { SavePipelineDTO } from '@application/content/dto/save.pipeline.dto';
import { Pipeline } from '@application/pipeline/dto/pipeline.dto';
import { configService } from '@infra/config/config.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { concat, firstValueFrom } from 'rxjs';

const endpoint = configService.getContentCraftersUrl() + '/pipeline';

@Injectable()
export class ContentService {
  constructor(private readonly httpService: HttpService) {}

  async savePipelineToMicroservice(
    pipeline: SavePipelineDTO,
  ): Promise<Pipeline> {
    Logger.log('pipeline: ' + JSON.stringify(pipeline));
    try {
      const response = await firstValueFrom(
        this.httpService.post(endpoint + '/create', pipeline, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      Logger.error('erreur ici: ' + error);
      throw new BadRequestException(error.response.data);
    }
  }

  async getPipelineFromMicroservice(pipelineId: string): Promise<Pipeline> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(endpoint + '/' + pipelineId),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getPipelineListFromMicroservice(): Promise<Pipeline[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(endpoint + '/list'),
      );

      Logger.log(endpoint + '/list');

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getOwnerPipelineListFromMicroservice(
    ownerId: string,
  ): Promise<Pipeline[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(endpoint + '/owner/' + ownerId),
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async deletePipelineFromMicroservice(pipelineId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(endpoint + '/' + pipelineId),
      );
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
}
