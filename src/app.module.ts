import { ApiModule } from '@infra/api.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
