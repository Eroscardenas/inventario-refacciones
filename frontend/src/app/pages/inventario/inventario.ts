import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import Toastify from 'toastify-js';

import { RefaccionForm } from '../../components/refaccion-form/refaccion-form';
import { RefaccionTable } from '../../components/refaccion-table/refaccion-table';
import { Refaccion } from '../../models/refaccion.model';
import { RefaccionesService } from '../../services/refacciones.service';

// seleccionamos la refaccion a editar o eliminar, y abre el formulario.
@Component({
  selector: 'app-inventario',
  imports: [
    CommonModule,
    FormsModule,
    RefaccionForm,
    RefaccionTable,
  ],
  templateUrl: './inventario.html',
})
// Pantalla principal del inventario de refacciones inicializando componentes y cargando la lista de refacciones.
export class Inventario implements OnInit {
  refacciones: Refaccion[] = [];
  refaccionSeleccionada: Refaccion | null = null;
  refaccionAEliminar: Refaccion | null = null;

  buscar = '';
  categoria = '';

  cargando = false;
  guardando = false;
  eliminando = false;

  mostrarFormulario = false;
  mostrarConfirmacion = false;

  constructor(private readonly refaccionesService: RefaccionesService) {}

  // carga las refacciones al abrir la pantalla al iniciar el componente.
  ngOnInit(): void {
    this.cargarRefacciones();
  }

  // consulta las refacciones con los filtros de busqueda y categoria
  cargarRefacciones(): void {
    this.cargando = true;

    this.refaccionesService
      .getAll(this.buscar.trim(), this.categoria.trim())
      .pipe(
        finalize(() => {
          this.cargando = false;
        }),
      )
      // obtiene la lista de refacciones y maneja errores en caso de fallo.
      .subscribe({
        next: (refacciones) => {
          this.refacciones = refacciones;
        },
        error: () => {
          this.mostrarToast(
            'No se pudieron cargar las refacciones.',
            'error',
          );
        },
      });
  }

  // suma todas las piezas disponibles.
  get totalPiezas(): number {
    return this.refacciones.reduce(
      (total, refaccion) => total + refaccion.stock,
      0,
    );
  }

  // limpiamos los filtros y carga nuevamente la lista
  limpiarFiltros(): void {
    this.buscar = '';
    this.categoria = '';
    this.cargarRefacciones();
  }

  // abrimos el formulario para registrar una refaccion
  abrirFormulario(): void {
    this.refaccionSeleccionada = null;
    this.mostrarFormulario = true;
  }

  // abrimos el formulario con los datos de la refaccion para ahora editar
  editarRefaccion(refaccion: Refaccion): void {
    this.refaccionSeleccionada = refaccion;
    this.mostrarFormulario = true;
  }

  // cerramos  el formulario
  cerrarFormulario(): void {
    if (this.guardando) {
      return;
    }

    this.mostrarFormulario = false;
    this.refaccionSeleccionada = null;
  }

  // decidir si se crea o actualiza la refaccion
  guardarRefaccion(
    formulario: Omit<Refaccion, 'id'>,
  ): void {
    this.guardando = true;

    if (this.refaccionSeleccionada) {
      this.actualizarRefaccion(
        this.refaccionSeleccionada.id,
        formulario,
      );

      return;
    }

    this.crearRefaccion(formulario);
  }

  // abrimos la confirmacion antes de eliminar una refaccion
  eliminarRefaccion(refaccion: Refaccion): void {
    this.refaccionAEliminar = refaccion;
    this.mostrarConfirmacion = true;
  }

  // cerramos la confirmacion sin eliminar la refaccion
  cancelarEliminacion(): void {
    if (this.eliminando) {
      return;
    }

    this.mostrarConfirmacion = false;
    this.refaccionAEliminar = null;
  }

  // confirmamos y eliminamos la refaccion seleccionada
  confirmarEliminacion(): void {
    if (!this.refaccionAEliminar) {
      return;
    }

    const refaccion = this.refaccionAEliminar;

    this.eliminando = true;

    // azctualizamos la lista de refacciones
    this.refaccionesService
      .delete(refaccion.id)
      .pipe(
        finalize(() => {
          this.eliminando = false;
        }),
      )
      .subscribe({
        next: () => {
          this.refacciones = this.refacciones.filter(
            (registro) => registro.id !== refaccion.id,
          );

          this.mostrarConfirmacion = false;
          this.refaccionAEliminar = null;

          this.mostrarToast(
            'Refacción eliminada correctamente.',
            'success',
          );
        },
        error: (respuesta) => {
          this.mostrarError(
            respuesta,
            'No se pudo eliminar la refacción.',
          );
        },
      });
  }

  // fx para crear una nueva refaccion y actualizar la lista de refacciones
  private crearRefaccion(
    formulario: Omit<Refaccion, 'id'>,
  ): void {
    this.refaccionesService
      .create(formulario)
      .pipe(
        finalize(() => {
          this.guardando = false;
        }),
      )
      .subscribe({
        next: (refaccionCreada) => {
          this.refacciones = [
            ...this.refacciones,
            refaccionCreada,
          ];

          this.mostrarFormulario = false;
          this.refaccionSeleccionada = null;

          this.mostrarToast(
            'Refacción registrada correctamente.',
            'success',
          );
        },
        error: (respuesta) => {
          this.mostrarError(
            respuesta,
            'No se pudo registrar la refacción.',
          );
        },
      });
  }

  // fx para actualizar una refaccion que ya existe
  private actualizarRefaccion(
    id: number,
    formulario: Omit<Refaccion, 'id'>,
  ): void {
    this.refaccionesService
      .update(id, formulario)
      .pipe(
        finalize(() => {
          this.guardando = false;
        }),
      )
      //y actualizamos la lista de refacciones con la refaccion actualizada
      .subscribe({
        next: (refaccionActualizada) => {
          this.refacciones = this.refacciones.map(
            (refaccion) =>
              refaccion.id === id
                ? refaccionActualizada
                : refaccion,
          );

          this.mostrarFormulario = false;
          this.refaccionSeleccionada = null;

          this.mostrarToast(
            'Refacción actualizada correctamente.',
            'success',
          );
        },
        error: (respuesta) => {
          this.mostrarError(
            respuesta,
            'No se pudo actualizar la refacción.',
          );
        },
      });
  }

  // mostramos el manejo de errores en caso de fallo en la peticion http
  private mostrarError(
    respuesta: {
      error?: {
        message?: string | string[];
      };
    },
    mensajePredeterminado: string,
  ): void {
    const mensaje = respuesta.error?.message;

    const texto = Array.isArray(mensaje)
      ? mensaje.join(', ')
      : mensaje || mensajePredeterminado;

    this.mostrarToast(texto, 'error');
  }

  // Muestra una notificación de éxito o error.
  private mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error',
  ): void {
    Toastify({
      text: mensaje,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      className:
        tipo === 'success'
          ? 'toast-success'
          : 'toast-error',
    }).showToast();
  }
}