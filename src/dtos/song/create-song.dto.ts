import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

// DTO for creating a new song
export class CreateSongDto {
    // Song title, must be a non-empty string
    @IsString()
    @IsNotEmpty()
    title: string;

    // Song duration in seconds, must be a positive number
    @IsNumber()
    @IsPositive()
    duration: number;

    // Artist ID, must be a positive number
    @IsNumber()
    @IsPositive()
    artistId: number;
}