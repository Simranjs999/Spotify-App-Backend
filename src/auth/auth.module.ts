import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * AuthModule bundles all authentication-related components:
 * - Registers User entity for TypeORM.
 * - Configures Passport and JWT modules for authentication.
 * - Loads environment variables via ConfigModule.
 * - Provides AuthService, JwtStrategy, and JwtAuthGuard.
 * - Exports AuthService, JwtModule, and JwtAuthGuard for use in other modules.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // User entity for DB operations
    PassportModule, // Passport authentication middleware
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // JWT secret from env
        signOptions: { expiresIn: '60m' }, // Token expiration
      }),
    }),
    ConfigModule, // Loads environment variables
  ],
  controllers: [AuthController],
  providers: [
    AuthService, // Business logic for auth
    JwtStrategy, // JWT validation strategy
    JwtAuthGuard // Route protection guardks
  ],
  exports: [AuthService, JwtModule, JwtAuthGuard],
})
export class AuthModule { }