import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateRefaccionDto } from './dto/create-refaccion.dto';
import { UpdateRefaccionDto } from './dto/update-refaccion.dto';
import { Refaccion } from './entities/refaccion.entity';

@Injectable()
export class RefaccionesService {
  constructor(
    // repositorio  utilizado  que  consulta y guardar refacciones.
    @InjectRepository(Refaccion)
    private readonly refaccionesRepository: Repository<Refaccion>,
  ) {}

  // guarda una nueva refaccion en la db.
  async create(createRefaccionDto: CreateRefaccionDto): Promise<Refaccion> {
    await this.validateUniqueSku(createRefaccionDto.sku);

    const refaccion = this.refaccionesRepository.create(createRefaccionDto);

    return this.refaccionesRepository.save(refaccion);
  }

  // obtiene las refacciones con busqueda y filtro opcionales.
  async findAll(buscar?: string, categoria?: string): Promise<Refaccion[]> {
    return this.refaccionesRepository.find({
      where: {
        ...(buscar ? { nombre: ILike(`%${buscar}%`) } : {}),
        ...(categoria ? { categoria: ILike(categoria) } : {}),
      },
      order: {
        id: 'ASC',
      },
    });
  }

  // obtiene una refaccion por su id.
  async findOne(id: number): Promise<Refaccion> {
    const refaccion = await this.refaccionesRepository.findOne({
      where: { id },
    });

    if (!refaccion) {
      throw new NotFoundException(`No se encontró la refacción con id ${id}`);
    }

    return refaccion;
  }

  // actualiza una refaccion existente.
  async update(
    id: number,
    updateRefaccionDto: UpdateRefaccionDto,
  ): Promise<Refaccion> {
    const refaccion = await this.findOne(id);

    if (updateRefaccionDto.sku && updateRefaccionDto.sku !== refaccion.sku) {
      await this.validateUniqueSku(updateRefaccionDto.sku);
    }

    this.refaccionesRepository.merge(refaccion, updateRefaccionDto);

    return this.refaccionesRepository.save(refaccion);
  }

  // elimina una refaccion por su id , por id es mas seguro que por sku ya que el id es unico y no se repite.
  async remove(id: number): Promise<void> {
    const refaccion = await this.findOne(id);

    await this.refaccionesRepository.remove(refaccion);
  }

  // valida que el SKU no esté registrado.
  private async validateUniqueSku(sku: string): Promise<void> {
    const refaccion = await this.refaccionesRepository.findOne({
      where: { sku },
    });

    if (refaccion) {
      throw new ConflictException(`El SKU ${sku} ya está registrado`);
    }
  }
}
