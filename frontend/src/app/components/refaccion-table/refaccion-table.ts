import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Refaccion } from '../../models/refaccion.model';

@Component({
  selector: 'app-refaccion-table',
  imports: [CommonModule],
  templateUrl: './refaccion-table.html',
})
export class RefaccionTable {
  @Input() refacciones: Refaccion[] = [];
  @Input() cargando = false;

  @Output() editar = new EventEmitter<Refaccion>();
  @Output() eliminar = new EventEmitter<Refaccion>();

  // Envía la refacción seleccionada para editar.
  seleccionarEdicion(refaccion: Refaccion): void {
    this.editar.emit(refaccion);
  }

  // Envía la refacción seleccionada para eliminar.
  seleccionarEliminacion(refaccion: Refaccion): void {
    this.eliminar.emit(refaccion);
  }
}