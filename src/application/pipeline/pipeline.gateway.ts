import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PipelineService } from '@domain/pipeline/services/pipeline.service';
import { CreatePipelineDto, StepResultDto } from './dto/pipeline.dto';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { ContentService } from '@domain/content/services/content.service';
import { SavePipelineDTO } from '@application/content/dto/save.pipeline.dto';
@WebSocketGateway({
  cors: {
    origin: '*', //configService.getFrontendUrl(),
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class PipelineGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly pipelineService: PipelineService,
    private readonly contentService: ContentService,
  ) {}

  @AsyncApiSub({
    channel: 'executePipeline',
    message: {
      payload: CreatePipelineDto,
    },
  })
  @SubscribeMessage('executePipeline')
  async handleExecutePipeline(
    @MessageBody() createPipelineDto: CreatePipelineDto,
  ): Promise<void> {
    try {
      const result = await this.pipelineService.executePipeline(
        createPipelineDto,
        (update) => {
          this.server.emit('pipelineUpdate', update);
        },
      );
      this.server.emit('pipelineResult', result);
    } catch (error) {
      this.server.emit('pipelineError', error.message);
    }
  }

  @AsyncApiPub({
    channel: 'pipelineUpdate',
    message: {
      payload: StepResultDto,
    },
  })
  sendUpdate(update: StepResultDto) {
    this.server.emit('pipelineUpdate', update);
  }

  @AsyncApiSub({
    channel: 'pipelineSave',
    message: {
      payload: CreatePipelineDto,
    },
  })
  @SubscribeMessage('pipelineSave')
  async handleSavePipeline(
    @MessageBody() savePipelineDto: SavePipelineDTO,
  ): Promise<void> {
    try {
      const result =
        await this.contentService.savePipelineToMicroservice(savePipelineDto);
      this.server.emit('pipelineSaved', result);
    } catch (error) {
      this.server.emit('pipelineError', error.message);
    }
  }
}
