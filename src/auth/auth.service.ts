import { Injectable, UnauthorizedException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { SignUpDto, LoginDto } from './dtos/index.dto';

/**
 * AuthService contains the core business logic for authentication.
 * It handles user registration, login, password hashing, and JWT token generation.
 */
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    /**
     * Registers a new user.
     * - Checks if the email is already in use.
     * - Hashes the password before saving.
     * - Saves the user to the database.
     * - Returns a success message or throws an error.
     */
    async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
        const { email, password } = signUpDto;
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.usersRepository.create({
            email,
            password: hashedPassword,
        });
        try {
            await this.usersRepository.save(newUser);
            return { message: 'User registered successfully' };
        } catch (error) {
            throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Authenticates a user and returns a JWT token.
     * - Finds the user by email.
     * - Compares the provided password with the stored hash.
     * - If valid, generates and returns a JWT token.
     * - Throws UnauthorizedException if credentials are invalid.
     */
    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            token: this.jwtService.sign(payload),
        };
    }
}