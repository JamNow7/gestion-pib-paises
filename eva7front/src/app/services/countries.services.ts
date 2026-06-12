import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Pais {
  nombre: string;
  continente: string;
  poblacion: number;
  pib_2019: number;
  pib_2020: number;
}

export interface ApiResponseV1<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface ApiResponseV2<T> {
  success: boolean;
  result: T;
  message?: string;
  error?: string;
}

export interface PaginationV2 {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PaisesResultV2 {
  countries: Pais[];
  pagination: PaginationV2;
  timestamp: string;
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private readonly STORAGE_KEY = 'api_version';
  private currentVersion = 'v1';

  constructor() {
    if (this.isBrowser()) {
      const savedVersion = localStorage.getItem(this.STORAGE_KEY);
      if (savedVersion === 'v1' || savedVersion === 'v2') {
        this.currentVersion = savedVersion;
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setVersion(version: 'v1' | 'v2') {
    this.currentVersion = version;
    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEY, version);
    }
  }

  getVersion(): string {
    return this.currentVersion || 'v1';
  }

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}/api/${this.currentVersion}${endpoint}`;
  }

  getPaises(limit = 10, offset = 0): Observable<any> {
    if (this.currentVersion === 'v1') {
      return this.http.get<ApiResponseV1<Pais[]>>(this.getUrl('/paises'), {
        params: { limit: limit.toString(), offset: offset.toString() }
      }).pipe(
        map(response => response.data)
      );
    } else {
      return this.http.get<ApiResponseV2<PaisesResultV2>>(this.getUrl('/paises'), {
        params: { limit: limit.toString(), offset: offset.toString() }
      }).pipe(
        map(response => response.result.countries)
      );
    }
  }

  crearPais(pais: Pais): Observable<any> {
    if (this.currentVersion === 'v1') {
      return this.http.post<ApiResponseV1<any>>(this.getUrl('/paises'), pais).pipe(
        map(response => response.message || 'País creado')
      );
    } else {
      return this.http.post<ApiResponseV2<any>>(this.getUrl('/paises'), pais).pipe(
        map(response => {
          if (response.result && typeof response.result === 'object' && 'message' in response.result) {
            return (response.result as any).message;
          }
          return response.message || 'País creado';
        })
      );
    }
  }

  eliminarPais(nombre: string): Observable<any> {
    if (this.currentVersion === 'v1') {
      return this.http.delete<ApiResponseV1<any>>(this.getUrl(`/paises/${nombre}`)).pipe(
        map(response => response.message || 'País eliminado')
      );
    } else {
      return this.http.delete<ApiResponseV2<any>>(this.getUrl(`/paises/${nombre}`)).pipe(
        map(response => {
          if (response.result && typeof response.result === 'object' && 'message' in response.result) {
            return (response.result as any).message;
          }
          return response.message || 'País eliminado';
        })
      );
    }
  }

  getPaisesByContinente(continente: string, limit = 10, offset = 0): Observable<Pais[]> {
    if (this.currentVersion !== 'v2') {
      console.warn('Búsqueda por continente solo disponible en V2');
      return of([]);
    }
    return this.http.get<ApiResponseV2<any>>(this.getUrl(`/paises/continente/${continente}`), {
      params: { limit: limit.toString(), offset: offset.toString() }
    }).pipe(
      map(response => response.result.countries || [])
    );
  }
}