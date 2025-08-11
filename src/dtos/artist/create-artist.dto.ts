import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// DTO for creating a new artist
export class CreateArtistDto {
  // Artist name, must be a non-empty string
  @IsString()
  @IsNotEmpty()
  name: string;

  // Optional biography, must be a string if provided
  @IsString()
  @IsOptional()
  biography?: string;
}