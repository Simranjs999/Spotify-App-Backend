import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSongDto } from 'src/dtos/song/create-song.dto';
import { UpdateSongDto } from 'src/dtos/song/update-song.dto';

@Controller('songs')
export class SongsController {
    constructor(private readonly songService: SongsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createSongDto: CreateSongDto) {
        return this.songService.create(createSongDto);
    }

    // Retrieve all songs (protected)
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.songService.findAll();
    }

    // Retrieve a single song by ID (protected)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.songService.findOne(+id);
    }

    // Update a song (protected)
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
        return this.songService.update(+id, updateSongDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.songService.remove(id);
    }
}
