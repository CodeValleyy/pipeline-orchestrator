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
import { configService } from '@infra/config/config.service';
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

  constructor(private readonly pipelineService: PipelineService) {}

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
}
