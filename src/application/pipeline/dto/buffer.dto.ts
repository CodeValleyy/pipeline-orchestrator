import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

export class BufferData {
    @ApiProperty()
    data: Uint8Array;
}

export class InputData {
    @ApiPropertyOptional({ type: 'string' })
    @IsString()
    stringInput?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => BufferData)
    bufferInput?: BufferData;
}
