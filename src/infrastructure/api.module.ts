import { Module } from '@nestjs/common';
import { ApiController } from '@application/api.controller';

@Module({
    imports: [],
    controllers: [ApiController],
})
export class ApiModule { }
