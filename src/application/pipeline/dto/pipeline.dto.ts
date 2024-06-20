import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString } from 'class-validator';

export class PayloadDto {
    @ApiProperty({ description: 'The code to execute', example: "print(f'Hello, {input_data}')" })
    @IsString()
    code: string;

    @ApiProperty({ description: 'The language of the code', example: 'python' })
    @IsString()
    language: string;

    @ApiProperty({ description: 'The input data for the code', example: 'World!' })
    @IsString()
    input: string;
}


export class StepDto {
    @ApiProperty({ description: 'The name of the service', example: 'dyno-code' })
    @IsString()
    service: string;

    @ApiProperty({ description: 'The endpoint to call', example: '/execute' })
    @IsString()
    endpoint: string;

    @ApiProperty({ description: 'The payload to send to the service', type: PayloadDto })
    @ValidateNested()
    @Type(() => PayloadDto)
    payload: PayloadDto;
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