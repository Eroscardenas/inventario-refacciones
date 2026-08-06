import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

// inicia la app usando el modulo principal
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // permite slas olicitudes desde el frontend
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  // agrega la api al inicio de todas las rutas
  app.setGlobalPrefix('api');

  // valida los datos recibidos por la api
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // usa el puerto del env o el 3000 como default
  await app.listen(process.env.PORT ?? 3000);
}

// captura errores al iniciar el servidor
bootstrap().catch((error: unknown) => {
  console.error('No se pudo iniciar la aplicación:', error);
  process.exit(1);
});
