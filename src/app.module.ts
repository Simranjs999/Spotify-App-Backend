import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ArtistsModule } from './artists/artists.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<number>('DB_PORT');
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbDatabase = configService.get<string>('DB_DATABASE');

        if (!dbHost || !dbPort || !dbUsername || !dbPassword || !dbDatabase) {
          Logger.error('Database configuration is incomplete. Please check your environment variables.', '', 'TypeORM');
          throw new Error('Database configuration is incomplete. Please check your environment variables.');
        }

        const dbConfig: TypeOrmModuleOptions = {
          type: 'postgres', // Explicitly set as the literal type
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbDatabase,
          entities: [User],
          synchronize: true,
          autoLoadEntities: true,
        };

        Logger.log(
          `Attempting to connect to database "${dbConfig.database}"...`,
          'TypeORM'
        );
        Logger.log(
          `Database configuration for "${dbConfig.database}" loaded successfully.`,
          'TypeORM'
        );
        return dbConfig;
      },
    }),
    AuthModule,
    ArtistsModule,
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }