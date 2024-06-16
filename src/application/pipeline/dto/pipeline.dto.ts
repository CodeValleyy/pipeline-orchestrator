import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString, IsObject } from 'class-validator';

export class StepDto {
    @ApiProperty({ description: 'The name of the service', example: 'dyno-code' })
    @IsString()
    service: string;

    @ApiProperty({ description: 'The endpoint to call', example: '/execute' })
    @IsString()
    endpoint: string;

    @ApiProperty({
        description: 'The payload to send', type: 'object', example: {
            language: "python",
            code: "print('Hello, World!')"
        }
    })
    @IsObject()
    payload: any;
}

export class CreatePipelineDto {
    @ApiProperty({ type: [StepDto], description: 'List of steps in the pipeline' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StepDto)
    steps: StepDto[];
}
