import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { RefaccionForm } from '../../components/refaccion-form/refaccion-form';
import { RefaccionTable } from '../../components/refaccion-table/refaccion-table';
import { Refaccion } from '../../models/refaccion.model';
import { RefaccionesService } from '../../services/refacciones.service';

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
export class Inventario implements OnInit {
  refacciones: Refaccion[] = [];
  refaccionSeleccionada: Refaccion | null = null;

  buscar = '';
  categoria = '';

  cargando = false;
  guardando = false;
  mostrarFormulario = false;

  mensaje = '';
  error = '';

  constructor(private readonly refaccionesService: RefaccionesService) {}

  // Carga las refacciones al abrir la pantalla.
  ngOnInit(): void {
    this.cargarRefacciones();
  }

  // Consulta las refacciones usando los filtros actuales.
  cargarRefacciones(): void {
    this.cargando = true;
    this.error = '';

    this.refaccionesService
      .getAll(this.buscar.trim(), this.categoria.trim())
      .pipe(
        finalize(() => {
          console.log('GET finalizado');
          this.cargando = false;
        }),
      )
      .subscribe({
        next: (refacciones) => {
          console.log('GET recibido', refacciones);
          this.refacciones = refacciones;
        },
        error: (respuesta) => {
          console.error('Error al cargar refacciones', respuesta);
          this.error = 'No se pudieron cargar las refacciones.';
        },
      });
  }

  // Suma todas las piezas disponibles.
  get totalPiezas(): number {
    return this.refacciones.reduce(
      (total, refaccion) => total + refaccion.stock,
      0,
    );
  }

  // Cuenta las refacciones con cinco piezas o menos.
  get stockBajo(): number {
    return this.refacciones.filter(
      (refaccion) => refaccion.stock <= 5,
    ).length;
  }

  // Limpia los filtros y vuelve a cargar la lista.
  limpiarFiltros(): void {
    this.buscar = '';
    this.categoria = '';
    this.cargarRefacciones();
  }

  // Abre el formulario para crear una refacción.
  abrirFormulario(): void {
    this.limpiarMensajes();
    this.refaccionSeleccionada = null;
    this.mostrarFormulario = true;
  }

  // Abre el formulario con los datos de la refacción seleccionada.
  editarRefaccion(refaccion: Refaccion): void {
    this.limpiarMensajes();
    this.refaccionSeleccionada = refaccion;
    this.mostrarFormulario = true;
  }

  // Cierra el formulario.
  cerrarFormulario(): void {
    if (this.guardando) {
      return;
    }

    this.mostrarFormulario = false;
    this.refaccionSeleccionada = null;
  }

  // Crea o actualiza según exista una refacción seleccionada.
  guardarRefaccion(
    formulario: Omit<Refaccion, 'id'>,
  ): void {
    console.log('1 - Inventario recibió guardar');

    this.limpiarMensajes();
    this.guardando = true;

    if (this.refaccionSeleccionada) {
      console.log(
        '2 - Se enviará actualización',
        this.refaccionSeleccionada.id,
      );

      this.actualizarRefaccion(
        this.refaccionSeleccionada.id,
        formulario,
      );

      return;
    }

    console.log('2 - Se enviará creación');

    this.crearRefaccion(formulario);
  }

  // Elimina una refacción después de confirmar.
  eliminarRefaccion(refaccion: Refaccion): void {
    const confirmado = window.confirm(
      `¿Deseas eliminar la refacción "${refaccion.nombre}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.limpiarMensajes();

    this.refaccionesService.delete(refaccion.id).subscribe({
      next: () => {
        this.refacciones = this.refacciones.filter(
          (registro) => registro.id !== refaccion.id,
        );

        this.mensaje = 'Refacción eliminada correctamente.';
      },
      error: (respuesta) => {
        console.error('Error al eliminar', respuesta);

        this.mostrarError(
          respuesta,
          'No se pudo eliminar la refacción.',
        );
      },
    });
  }

  // Registra una nueva refacción.
  private crearRefaccion(
    formulario: Omit<Refaccion, 'id'>,
  ): void {
    console.log('3 - Antes del POST');

    this.refaccionesService
      .create(formulario)
      .pipe(
        finalize(() => {
          console.log('5 - POST finalizado');

          this.guardando = false;
        }),
      )
      .subscribe({
        next: (refaccionCreada) => {
          console.log(
            '4 - POST respondió correctamente',
            refaccionCreada,
          );

          this.refacciones = [
            ...this.refacciones,
            refaccionCreada,
          ];

          this.mensaje = 'Refacción registrada correctamente.';
          this.mostrarFormulario = false;
          this.refaccionSeleccionada = null;
        },
        error: (respuesta) => {
          console.error('POST falló', respuesta);

          this.mostrarError(
            respuesta,
            'No se pudo registrar la refacción.',
          );
        },
      });
  }

  // Actualiza una refacción existente.
  private actualizarRefaccion(
    id: number,
    formulario: Omit<Refaccion, 'id'>,
  ): void {
    console.log('3 - Antes del PUT');

    this.refaccionesService
      .update(id, formulario)
      .pipe(
        finalize(() => {
          console.log('5 - PUT finalizado');

          this.guardando = false;
        }),
      )
      .subscribe({
        next: (refaccionActualizada) => {
          console.log(
            '4 - PUT respondió correctamente',
            refaccionActualizada,
          );

          this.refacciones = this.refacciones.map(
            (refaccion) =>
              refaccion.id === id
                ? refaccionActualizada
                : refaccion,
          );

          this.mensaje = 'Refacción actualizada correctamente.';
          this.mostrarFormulario = false;
          this.refaccionSeleccionada = null;
        },
        error: (respuesta) => {
          console.error('PUT falló', respuesta);

          this.mostrarError(
            respuesta,
            'No se pudo actualizar la refacción.',
          );
        },
      });
  }

  // Obtiene el mensaje enviado por el backend.
  private mostrarError(
    respuesta: {
      error?: {
        message?: string | string[];
      };
    },
    mensajePredeterminado: string,
  ): void {
    const mensaje = respuesta.error?.message;

    this.error = Array.isArray(mensaje)
      ? mensaje.join(', ')
      : mensaje || mensajePredeterminado;
  }

  // Limpia los mensajes anteriores.
  private limpiarMensajes(): void {
    this.mensaje = '';
    this.error = '';
  }
}