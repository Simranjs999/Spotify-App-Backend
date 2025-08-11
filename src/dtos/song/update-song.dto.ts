import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

// DTO for updating an existing song
export class UpdateSongDto {
    // Optional title, must be a string if provided
    @IsString()
    @IsOptional()
    title?: string;

    // Optional duration, must be a positive number if provided
    @IsNumber()
    @IsPositive()
    @IsOptional()
    duration?: number;

    // Optional artist ID, must be a positive number if provided
    @IsNumber()
    @IsPositive()
    @IsOptional()
    artistId?: number;
}