import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('refacciones')
export class Refaccion {
  // identificador generado automaticamente.
  @PrimaryGeneratedColumn()
  id!: number;

  // nombre de la refaccion definiedolo como varchar y el max de 120 caracteres.
  @Column({ type: 'varchar', length: 120 })
  nombre!: string;

  // codigo unico de la refaccion, definiendo correcamente sus tipados.
  @Column({ type: 'varchar', length: 50, unique: true })
  sku!: string;

  // categoría en la que entra la refaccion
  @Column({ type: 'varchar', length: 80 })
  categoria!: string;

  // precio con dos decimales
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio!: number;

  // cantidad  de la refaccion disponible.
  @Column({ type: 'integer', default: 0 })
  stock!: number;
}
