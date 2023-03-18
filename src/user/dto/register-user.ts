import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class RegisterUserDTO {
  @ApiProperty({
    description: 'Username',
    required: true,
  })
  @IsString()
  @MaxLength(255)
  @Type(() => String)
  readonly username: string;

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  @IsString()
  @Type(() => String)
  readonly password: string;
}

export default RegisterUserDTO;
