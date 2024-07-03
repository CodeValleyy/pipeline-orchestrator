import packageJson from '../package.json';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureSwagger } from '@infra/config/swagger.config';
import { setupAsyncApi } from '@infra/config/asyncapi.config';

async function bootstrap() {
  const logger = new Logger('PipelineOrchestrator');

  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const hostname = configService.get<string>('APP_HOSTNAME') || 'localhost';
  const port =
    Number.parseInt(process.env.APP_PORT) ||
    configService.get<number>('APP_PORT') ||
    3000;

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const validationOptions: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
  };
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  configureSwagger(app);
  await setupAsyncApi(app);

  await app.listen(port, () => {
    logger.log(`${packageJson.name} is listening on port ${port}`);
    logger.log(`Swagger is available on ${hostname}/api`);
    logger.log(`AsyncAPI is available on ${hostname}/asyncapi`);
  });
}
bootstrap();
