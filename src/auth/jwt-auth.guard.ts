import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard is a custom guard that protects routes using JWT authentication.
 * It extends NestJS's built-in AuthGuard with the 'jwt' strategy, which is provided by passport-jwt.
 * 
 * When applied to a route (using @UseGuards), it will:
 * - Extract the JWT from the Authorization header (Bearer token).
 * - Validate the token using JwtStrategy.
 * - Attach the validated user object to the request if successful.
 * - Throw UnauthorizedException if validation fails.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    /**
     * handleRequest is called after the JWT strategy runs.
     * If authentication fails (no user or error), it throws UnauthorizedException.
     * If successful, it returns the user object, which is then attached to req.user.
     */
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}