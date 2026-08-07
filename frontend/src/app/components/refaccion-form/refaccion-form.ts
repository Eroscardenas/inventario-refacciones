import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Refaccion } from '../../models/refaccion.model';

// Formulario para crear o editar una refacción.
@Component({
  selector: 'app-refaccion-form',
  imports: [FormsModule],
  templateUrl: './refaccion-form.html',
})
export class RefaccionForm implements OnChanges {
  @Input() abierto = false;
  @Input() guardando = false;
  @Input() refaccion: Refaccion | null = null;
  @Input() categorias: string[] = [];

  @Output() guardar = new EventEmitter<Omit<Refaccion, 'id'>>();
  @Output() cerrar = new EventEmitter<void>();

  formulario: Omit<Refaccion, 'id'> = this.crearFormularioVacio();

  // se cargan los datos cuando se edita una refaccion
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['refaccion']) {
      return;
    }

    if (this.refaccion) {
      this.formulario = {
        nombre: this.refaccion.nombre,
        sku: this.refaccion.sku,
        categoria: this.refaccion.categoria,
        precio: Number(this.refaccion.precio),
        stock: this.refaccion.stock,
      };

      return;
    }

    this.formulario = this.crearFormularioVacio();
  }

  // se valida el formulario con los campos requeridos
  enviarFormulario(): void {
    if (!this.formularioValido()) {
      return;
    }

    this.guardar.emit({
      nombre: this.formulario.nombre.trim(),
      sku: this.formulario.sku.trim(),
      categoria: this.formulario.categoria.trim(),
      precio: Number(this.formulario.precio),
      stock: Number(this.formulario.stock),
    });
  }

  // cerrar el formulario y limpiar los datos
  cancelar(): void {
    this.cerrar.emit();
  }

  get esEdicion(): boolean {
    return this.refaccion !== null;
  }

  private formularioValido(): boolean {
    return (
      this.formulario.nombre.trim().length > 0 &&
      this.formulario.sku.trim().length > 0 &&
      this.formulario.categoria.trim().length > 0 &&
      Number(this.formulario.precio) >= 0 &&
      Number.isInteger(Number(this.formulario.stock)) &&
      Number(this.formulario.stock) >= 0
    );
  }
// crea un formulario vacio para registrar una nueva refaccion
  private crearFormularioVacio(): Omit<Refaccion, 'id'> {
    return {
      nombre: '',
      sku: '',
      categoria: '',
      precio: 0,
      stock: 0,
    };
  }
}