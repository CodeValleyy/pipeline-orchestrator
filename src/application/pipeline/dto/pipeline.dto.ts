import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsString, IsInt } from 'class-validator';

export class PayloadDto {
  @ApiProperty({
    description: 'The code to execute',
    example: "print(f'Hello, {input_data}')",
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The output extension',
    example: '.txt',
    default: '.txt',
  })
  @IsString()
  output_extension: string;

  @ApiProperty({ description: 'The language of the code', example: 'python' })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'The input data for the code',
    type: 'string',
    format: 'binary',
    required: false,
  })
  input_file?: any;
}

export class StepDto {
  @ApiProperty({ description: 'The name of the service', example: 'dyno-code' })
  @IsString()
  service: string;

  @ApiProperty({ description: 'The endpoint to call', example: '/execute' })
  @IsString()
  endpoint: string;

  @ApiProperty({
    description: 'The payload to send to the service',
    type: PayloadDto,
  })
  @ValidateNested()
  @Type(() => PayloadDto)
  payload: PayloadDto;
}

export class CreatePipelineDto {
  @ApiProperty({
    type: [StepDto],
    description: 'List of steps in the pipeline',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps: StepDto[];
}

export class StepResultDto {
  @ApiProperty({
    description: 'The error message if the step failed',
    example: 'An error occurred',
  })
  error: string;

  @ApiProperty({
    description: 'The result of the step execution',
    example: '15',
  })
  output: string;

  @ApiProperty({
    description: 'The content of the output file',
    example: 'bla bla bla',
  })
  output_file_content?: string;

  @ApiProperty({
    description: 'The path of the output file',
    example: 'output.txt',
  })
  output_file_path?: string;

  @ApiProperty({
    description: 'The number of the step in the pipeline',
    example: 1,
  })
  stepNumber: number;
}

export class Pipeline {
  @ApiProperty({
    description: 'The ID of the pipeline',
    example: '60f7b3b3d4b3f3b3f3b3f3b3',
  })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The owner ID of the pipeline', example: 121 })
  @IsInt()
  owner_id: number;

  @ApiProperty({
    description: 'The name of the pipeline',
    example: 'example_pipeline',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the pipeline',
    example: 'example_description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The steps in the pipeline',
    type: [String],
    example: ['60f7b3b3d4b3f3b3f3b3f3b3', '60f7b3b3d4b3f3b3f3b3f3b4'],
  })
  @IsArray()
  @IsString({ each: true })
  steps: string[];

  @ApiProperty({
    description: 'The created date of the pipeline',
    example: '2022-01-01T00:00:00Z',
  })
  @IsString()
  created_date: string;
}
