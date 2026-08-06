import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Refaccion } from './entities/refaccion.entity';
import { RefaccionesController } from './refacciones.controller';
import { RefaccionesService } from './refacciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Refaccion])],
  controllers: [RefaccionesController],
  providers: [RefaccionesService],
})
export class RefaccionesModule {}
