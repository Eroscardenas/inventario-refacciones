import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// iniciando la aplicacion usando el modulo principal de la aplicacion
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //usamos el puerto en el env o el puerto 3000
  await app.listen(process.env.PORT ?? 3000);
}
//captura el error que pudiera existir al inicializar
bootstrap().catch((error: unknown) => {
  console.error('No se pudo iniciar la aplicación:', error);
  //finaliza el proceso indicando el error
  process.exit(1);
});
