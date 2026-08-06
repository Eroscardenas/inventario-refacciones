import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRefaccionDto {
  // define nombre requerido con maximo de caracteres y no puede estar vacio.
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  // SKU siguiendo las reglas de validacion, requerido y maximo de caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku!: string;

  // categoria requerida con máximo de 80 caracteres.
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  categoria!: string;

  // El precio debe ser numerico y no puede ser negativo.
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio!: number;

  // El stock debe ser un num entero y no puede ser negativo.
  @IsInt()
  @Min(0)
  stock!: number;
}
