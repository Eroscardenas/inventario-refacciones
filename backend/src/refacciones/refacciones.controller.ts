import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateRefaccionDto } from './dto/create-refaccion.dto';
import { UpdateRefaccionDto } from './dto/update-refaccion.dto';
import { Refaccion } from './entities/refaccion.entity';
import { RefaccionesService } from './refacciones.service';

@Controller('refacciones')
export class RefaccionesController {
  constructor(private readonly refaccionesService: RefaccionesService) {}

  // Registra una nueva refacción.
  @Post()
  create(@Body() createRefaccionDto: CreateRefaccionDto): Promise<Refaccion> {
    return this.refaccionesService.create(createRefaccionDto);
  }

  // Lista refacciones y permite buscar o filtrar.
  @Get()
  findAll(
    @Query('buscar') buscar?: string,
    @Query('categoria') categoria?: string,
  ): Promise<Refaccion[]> {
    return this.refaccionesService.findAll(buscar, categoria);
  }

  // Obtiene una refacción por id.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Refaccion> {
    return this.refaccionesService.findOne(id);
  }

  // Actualiza una refacción.
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRefaccionDto: UpdateRefaccionDto,
  ): Promise<Refaccion> {
    return this.refaccionesService.update(id, updateRefaccionDto);
  }

  // Elimina una refacción.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.refaccionesService.remove(id);
  }
}
