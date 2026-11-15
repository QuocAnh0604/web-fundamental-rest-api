import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString({ message: "authorName must be a string" })
  @IsNotEmpty({ message: "authorName is required" })
  authorName!: string;

  @IsNumber({}, { message: "rating must be a number from 1 to 5" })
  @Min(1, { message: "rating must be a number from 1 to 5" })
  @Max(5, { message: "rating must be a number from 1 to 5" })
  rating!: number;

  @IsOptional()
  @IsString({ message: "comment must be a string" })
  comment?: string;
}