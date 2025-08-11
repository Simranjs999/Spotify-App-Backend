import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Song } from './song.entity';

// Defining the Artist entity to represent a music artist
@Entity()
export class Artist {
    // Primary key with auto-increment
    @PrimaryGeneratedColumn()
    id: number;

    // Artist's name, required
    @Column()
    name: string;

    // Optional biography for the artist
    @Column({ nullable: true })
    biography: string;

    // One-to-many relationship with Song (an artist has many songs)
    @OneToMany(() => Song, (song) => song.artist)
    songs: Song[];
}