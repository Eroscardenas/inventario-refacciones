import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Refaccion } from '../models/refaccion.model';

@Injectable({
  providedIn: 'root',
})
export class RefaccionesService {
  private readonly apiUrl = 'http://localhost:3000/api/refacciones';

  constructor(private readonly http: HttpClient) {}

  // Obtiene todas las refacciones.
  getAll(buscar?: string, categoria?: string): Observable<Refaccion[]> {
    let params = new HttpParams();

    if (buscar) {
      params = params.set('buscar', buscar);
    }

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<Refaccion[]>(this.apiUrl, { params });
  }

  // Obtiene una refacción por id.
  getById(id: number): Observable<Refaccion> {
    return this.http.get<Refaccion>(`${this.apiUrl}/${id}`);
  }

  // Registra una nueva refacción.
  create(refaccion: Omit<Refaccion, 'id'>): Observable<Refaccion> {
    return this.http.post<Refaccion>(this.apiUrl, refaccion);
  }

  // Actualiza una refacción.
  update(
    id: number,
    refaccion: Partial<Omit<Refaccion, 'id'>>,
  ): Observable<Refaccion> {
    return this.http.put<Refaccion>(`${this.apiUrl}/${id}`, refaccion);
  }

  // Elimina una refacción.
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}