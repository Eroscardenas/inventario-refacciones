import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input,Output } from '@angular/core';
import { Refaccion } from '../../models/refaccion.model';

@Component({
  selector: 'app-refaccion-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './refaccion-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefaccionTable {
  @Input({ required: true })
  refacciones: Refaccion[] = [];

  @Input()
  cargando = false;

  @Output()
  editar = new EventEmitter<Refaccion>();

  @Output()
  eliminar = new EventEmitter<Refaccion>();

  // toma la refacción seleccionada y permite editarla
  seleccionarEdicion(refaccion: Refaccion): void {
    this.editar.emit(refaccion);
  }

  // elimina la refaccion seleccionada
  seleccionarEliminacion(refaccion: Refaccion): void {
    this.eliminar.emit(refaccion);
  }

  // el stock es bajo
  esStockBajo(refaccion: Refaccion): boolean {
    return refaccion.stock <= 10;
  }

  // le damos color del indicador de stock.
  obtenerClaseStock(refaccion: Refaccion): string {
    return this.esStockBajo(refaccion)
      ? 'text-red-300 bg-red-500/10 border-red-500/20'
      : 'text-slate-200 bg-slate-800 border-slate-700';
  }

  //  reutilizar la fila cuando se renderiza
  trackById(
    _: number,
    refaccion: Refaccion,
  ): number {
    return refaccion.id;
  }
}