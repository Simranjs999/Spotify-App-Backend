import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Artist } from './artist.entity';

// Defining the Song entity to represent a music track
@Entity()
export class Song {
    // Primary key with auto-increment
    @PrimaryGeneratedColumn()
    id: number;

    // Song title, required
    @Column()
    title: string;

    // Song duration in seconds, required
    @Column()
    duration: number;

    // Many-to-one relationship with Artist (a song belongs to one artist)
    @ManyToOne(() => Artist, (artist) => artist.songs)
    artist: Artist;
}