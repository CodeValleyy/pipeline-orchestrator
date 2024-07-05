import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsArray } from 'class-validator';

export class SavePipelineDTO {
  @ApiProperty({ example: 121 })
  @IsInt()
  owner_id: number;

  @ApiProperty({ example: 'example_pipeline' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'example_description' })
  @IsString()
  description: string;

  @ApiProperty({
    example: ['60f7b3b3d4b3f3b3f3b3f3b3', '60f7b3b3d4b3f3b3f3b3f3b3'],
  })
  @IsArray()
  @IsString({ each: true })
  steps: string[];
}
