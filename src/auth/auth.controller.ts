import { Body, Controller, Post, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dtos/index.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

/**
 * AuthController handles HTTP requests related to authentication.
 * It exposes endpoints for signup, login, and a protected profile route.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /auth/signup
     * Registers a new user.
     * Accepts SignUpDto in the request body.
     */
    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 409, description: 'Email already in use.' })
    @ApiBody({ type: SignUpDto })
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    /**
     * POST /auth/login
     * Authenticates a user and returns a JWT token.
     * Accepts LoginDto in the request body.
     */
    @Post('login')
    @ApiOperation({ summary: 'Log in an existing user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    @ApiBody({ type: LoginDto })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    /**
     * GET /auth/profile
     * Protected route that returns the authenticated user's profile.
     * Requires a valid JWT token in the Authorization header.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getProfile(@Request() req) {
        // req.user is populated by JwtAuthGuard
        return req.user;
    }
}