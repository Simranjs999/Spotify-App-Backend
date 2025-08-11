import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArtistDto } from 'src/dtos/artist/create-artist.dto';
import { UpdateArtistDto } from 'src/dtos/artist/update-artist.dto';
import { Artist } from 'src/entities/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
    ) { }

    // Create a new artist
    async create(createArtistDto: CreateArtistDto) {
        const artist = this.artistRepository.create(createArtistDto);
        return this.artistRepository.save(artist);
    }

    // Retrieve all artists
    async findAll() {
        return this.artistRepository.find();
    }

    // Retrieve a single artist by ID
    async findOne(id: number) {
        const artist = await this.artistRepository.findOne({ where: { id } });
        if (!artist) {
            throw new NotFoundException(`Artist with ID ${id} not found`);
        }
        return artist;
    }

    // Update an existing artist
    async update(id: number, updateArtistDto: UpdateArtistDto) {
        const artist = await this.findOne(id);
        // Copy all properties from updateArtistDto to the artist entity.
        // This will overwrite the artist's fields with any new values provided in the DTO.
        // For example, if updateArtistDto = { name: "New Name" }, artist.name will be updated.
        Object.assign(artist, updateArtistDto);
        return this.artistRepository.save(artist);
    }

    // Delete an artist
    async remove(id: number) {
        const artist = await this.findOne(id);
        await this.artistRepository.remove(artist);
    }

}
