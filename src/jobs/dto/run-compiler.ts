import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import IsExtensionType from '@jobs/validator/extension-type';
import ExtensionType from '@jobs/enum/extension-type';

class RunCompilerDto {
  @ApiProperty({
    description: 'File Extension',
    required: true,
  })
  @IsExtensionType()
  @Type(() => String)
  readonly extension: ExtensionType;

  @ApiProperty({
    description: 'File Code',
    required: true,
  })
  @IsString()
  @Type(() => String)
  readonly code: string;

  @ApiProperty({
    description: 'File Input',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly input?: string;
}

export default RunCompilerDto;
