import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSongDto } from 'src/dtos/song/create-song.dto';
import { UpdateSongDto } from 'src/dtos/song/update-song.dto';
import { Artist } from 'src/entities/artist.entity';
import { Song } from 'src/entities/song.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
    ) { }

    // Create a new song
    async create(createSongDto: CreateSongDto): Promise<Song> {
        const artist = await this.artistRepository.findOne({ where: { id: createSongDto.artistId } });
        if (!artist) {
            throw new NotFoundException(`Artist with ID ${createSongDto.artistId} not found`);
        }
        const song = this.songRepository.create({ ...createSongDto, artist });
        return this.songRepository.save(song);
    }

    // Retrieve all songs
    async findAll(): Promise<Song[]> {
        return this.songRepository.find({ relations: ['artist'] });
    }

    // Retrieve a single song by ID
    async findOne(id: number): Promise<Song> {
        const song = await this.songRepository.findOne({ where: { id }, relations: ['artist'] });
        if (!song) {
            throw new NotFoundException(`Song with ID ${id} not found`);
        }
        return song;
    }

    // Update an existing song
    async update(id: number, updateSongDto: UpdateSongDto): Promise<Song> {
        const song = await this.findOne(id);
        if (updateSongDto.artistId) {
            const artist = await this.artistRepository.findOne({ where: { id: updateSongDto.artistId } });
            if (!artist) {
                throw new NotFoundException(`Artist with ID ${updateSongDto.artistId} not found`);
            }
            song.artist = artist;
        }
        Object.assign(song, updateSongDto);
        return this.songRepository.save(song);
    }

    // Delete a song
    async remove(id: number): Promise<void> {
        const song = await this.findOne(id);
        await this.songRepository.remove(song);
    }

}
