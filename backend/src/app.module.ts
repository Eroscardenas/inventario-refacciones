import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Lee las variables almacenadas en el archivo .env.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configura la conexión con PostgreSQL.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        // Datos del servidor de la base de datos.
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),

        // Usuario y contraseña utilizados para conectarse.
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),

        // Base de datos utilizada por la aplicación.
        database: configService.getOrThrow<string>('DB_DATABASE'),

        // Carga automáticamente las entidades registradas en los módulos.
        autoLoadEntities: true,

        // Crea o actualiza las tablas a partir de las entidades.
        synchronize: true,
      }),
    }),
  ],

  // Recibe las peticiones HTTP principales.
  controllers: [AppController],

  // Contiene la lógica utilizada por el controlador principal.
  providers: [AppService],
})
export class AppModule {}
