import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  /**
   * Recarga la página actual.
   * Extraído en un servicio para facilitar el testing.
   */
  reload(): void {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    }
  }
}
