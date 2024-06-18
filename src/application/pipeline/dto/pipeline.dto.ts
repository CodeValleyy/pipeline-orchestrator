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

export class StepResultDto {
    @ApiProperty({
        description: 'The result of the step execution',
        example: '15',
    })
    output: string;

    @ApiProperty({
        description: 'The error message if the step failed',
        example: 'An error occurred',
    })
    error: string;

    @ApiProperty({
        description: 'The number of the step in the pipeline',
        example: 1,
    })
    stepNumber: number;
}