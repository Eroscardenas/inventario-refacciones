import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

// inicia la aplicacion usando el modulo principal.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // agrega /api al inicio de todas las rutas.
  app.setGlobalPrefix('api');

  // valida los datos recibidos por la API.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // usa el puerto del .env o el 3000 como respaldo.
  await app.listen(process.env.PORT ?? 3000);
}

// captura errores al iniciar el servidor.
bootstrap().catch((error: unknown) => {
  console.error('No se pudo iniciar la aplicación:', error);
  process.exit(1);
});
