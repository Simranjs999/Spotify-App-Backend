import { IsString, IsOptional } from 'class-validator';

// DTO for updating an existing artist
export class UpdateArtistDto {
    // Optional name, must be a string if provided
    @IsString()
    @IsOptional()
    name?: string;

    // Optional biography, must be a string if provided
    @IsString()
    @IsOptional()
    biography?: string;
}