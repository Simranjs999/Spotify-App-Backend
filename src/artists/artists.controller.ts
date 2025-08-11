import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateArtistDto } from 'src/dtos/artist/create-artist.dto';
import { UpdateArtistDto } from 'src/dtos/artist/update-artist.dto';

@Controller('artists')
export class ArtistsController {

    constructor(private readonly artistService: ArtistsService) { }

    // Create a new artist (protected)
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createArtistDto: CreateArtistDto) {
        return this.artistService.create(createArtistDto);
    }

    // Retrieve all artists (protected)
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.artistService.findAll();
    }

    // Retrieve a single artist by ID (protected)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.artistService.findOne(+id);
    }

    // Update an artist (protected)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
        return this.artistService.update(+id, updateArtistDto);
    }

    // Delete an artist (protected)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.artistService.remove(+id);
    }

}
