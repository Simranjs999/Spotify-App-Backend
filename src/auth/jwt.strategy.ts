import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * JwtStrategy defines how JWT tokens are validated and how user data is extracted from them.
 * It uses the passport-jwt library and is registered as a Passport strategy.
 * 
 * - Extracts JWT from the Authorization header as a Bearer token.
 * - Uses the secret key from environment variables to verify the token.
 * - Validates the payload and fetches the user from the database.
 * - If the user exists, attaches user info to the request; otherwise, throws UnauthorizedException.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    /**
     * Called after token verification.
     * Finds the user by ID from the payload and returns user info.
     * Throws UnauthorizedException if user is not found.
     */
    async validate(payload: { sub: number; email: string }) {
        const user = await this.usersRepository.findOneBy({ id: payload.sub });
        if (!user) {
            throw new UnauthorizedException();
        }
        // This object will be attached to req.user
        return { userId: user.id, email: user.email };
    }
}