import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

class AverageRatingDto {
    @ApiProperty({
        description: 'Course ID',
        type: Number,
        required: true,
    })
    @IsNumber()
    @Type(() => Number)
    readonly courseId: number;
}

export default AverageRatingDto;