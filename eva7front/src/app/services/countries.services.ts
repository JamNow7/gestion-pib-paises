import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pais {
  nombre: string;
  continente: string;
  poblacion: number;
  pib_2019: number;
  pib_2020: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private http = inject(HttpClient);
  // URL de la API configurada en variables de entorno
  private apiUrl = environment.fullApiUrl;

  getPaises(limit = 10, offset = 0): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }

  crearPais(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.apiUrl, pais);
  }

  eliminarPais(nombre: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${nombre}`);
  }
}