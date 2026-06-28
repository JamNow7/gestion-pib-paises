/**
 * Tests unitarios para CountriesService
 * Prueba el manejo de versiones V1/V2 y todas las operaciones del servicio
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CountriesService, Pais, ApiResponseV1, ApiResponseV2, PaisesResultV2 } from './countries.services';

describe('CountriesService', () => {
  let service: CountriesService;
  let httpMock: HttpTestingController;

  const mockPaises: Pais[] = [
    { nombre: 'TestCountry1', continente: 'Europa', poblacion: 1000000, pib_2019: 50000, pib_2020: 51000 },
    { nombre: 'TestCountry2', continente: 'America', poblacion: 2000000, pib_2019: 30000, pib_2020: 31000 }
  ];

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountriesService]
    });

    service = TestBed.inject(CountriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Constructor & Version Management', () => {
    it('debe crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debe inicializar con versión v1 por defecto', () => {
      expect(service.getVersion()).toBe('v1');
    });

    it('debe recuperar versión guardada de localStorage', () => {
      // Simular localStorage con versión v2
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('api_version', 'v2');
      }

      // Reconstruir el servicio para que lea localStorage
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [CountriesService]
      });

      const service2 = TestBed.inject(CountriesService);
      expect(service2.getVersion()).toBe('v2');

      // Limpiar para no afectar otros tests
      localStorage.clear();
    });

    it('debe ignorar versiones inválidas en localStorage', () => {
      // Simular localStorage con versión inválida
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('api_version', 'v3');
      }

      // Reconstruir el servicio
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [CountriesService]
      });

      const service2 = TestBed.inject(CountriesService);
      expect(service2.getVersion()).toBe('v1'); // Debe usar default

      // Limpiar para no afectar otros tests
      localStorage.clear();
    });

    it('setVersion() debe actualizar versión actual', () => {
      service.setVersion('v2');
      expect(service.getVersion()).toBe('v2');

      service.setVersion('v1');
      expect(service.getVersion()).toBe('v1');
    });

    it('setVersion() debe persistir en localStorage', () => {
      if (typeof localStorage !== 'undefined') {
        service.setVersion('v2');
        expect(localStorage.getItem('api_version')).toBe('v2');

        service.setVersion('v1');
        expect(localStorage.getItem('api_version')).toBe('v1');
      }
    });
  });

  describe('getPaises()', () => {
    it('debe llamar endpoint V1 correcto y extraer response.data', (done) => {
      // V1 por defecto
      service.getPaises(10, 0).subscribe(paises => {
        expect(paises).toEqual(mockPaises);
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url.includes('/api/v1/paises') &&
        req.params.get('limit') === '10' &&
        req.params.get('offset') === '0'
      );

      expect(req.request.method).toBe('GET');

      // Respuesta V1: { ok: true, data: [...] }
      req.flush({ ok: true, data: mockPaises });
    });

    it('debe llamar endpoint V2 correcto y extraer response.result.countries', (done) => {
      service.setVersion('v2');

      const mockV2Response: ApiResponseV2<PaisesResultV2> = {
        success: true,
        result: {
          countries: mockPaises,
          pagination: { total: 2, limit: 10, offset: 0, hasMore: false },
          timestamp: new Date().toISOString(),
          version: '2.0'
        }
      };

      service.getPaises(10, 0).subscribe(paises => {
        expect(paises).toEqual(mockPaises);
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url.includes('/api/v2/paises') &&
        req.params.get('limit') === '10' &&
        req.params.get('offset') === '0'
      );

      req.flush(mockV2Response);
    });

    it('debe pasar limit y offset como parámetros', (done) => {
      service.getPaises(20, 10).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url.includes('/api/v1/paises') &&
        req.params.get('limit') === '20' &&
        req.params.get('offset') === '10'
      );

      req.flush({ ok: true, data: [] });
    });

    it('debe manejar errores HTTP', (done) => {
      service.getPaises().subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/v1/paises'));
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('crearPais()', () => {
    const nuevoPais: Pais = {
      nombre: 'NuevoPais',
      continente: 'Europa',
      poblacion: 5000000,
      pib_2019: 40000,
      pib_2020: 41000
    };

    it('debe POST a /paises y extraer message en V1', (done) => {
      service.crearPais(nuevoPais).subscribe(message => {
        expect(message).toBe('País creado exitosamente');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/v1/paises'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(nuevoPais);

      req.flush({ ok: true, message: 'País creado exitosamente' });
    });

    it('deve POST a /paises y extraer result.message en V2', (done) => {
      service.setVersion('v2');

      const mockV2Response: ApiResponseV2<any> = {
        success: true,
        result: {
          country: nuevoPais,
          created_at: new Date().toISOString(),
          version: '2.0',
          message: 'País creado exitosamente'
        }
      };

      service.crearPais(nuevoPais).subscribe(message => {
        expect(message).toBe('País creado exitosamente');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/v2/paises'));
      expect(req.request.method).toBe('POST');

      req.flush(mockV2Response);
    });

    it('deve usar message directo si result.message no existe en V2', (done) => {
      service.setVersion('v2');

      const mockResponse: ApiResponseV2<any> = {
        success: true,
        message: 'Mensaje directo',
        result: { country: nuevoPais }
      };

      service.crearPais(nuevoPais).subscribe(message => {
        expect(message).toBe('Mensaje directo');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/v2/paises'));
      req.flush(mockResponse);
    });

    it('deve retornar fallback si no hay message', (done) => {
      service.crearPais(nuevoPais).subscribe(message => {
        expect(message).toBe('País creado');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/v1/paises'));
      req.flush({ ok: true }); // Sin message
    });

    it('debe manejar errores HTTP', (done) => {
      service.crearPais(nuevoPais).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(req => req.url.includes('/api/v1/paises'));
      req.flush('Error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('eliminarPais()', () => {
    const nombrePais = 'PaisAEliminar';

    it('debe DELETE a /paises/:nombre y extraer message en V1', (done) => {
      service.eliminarPais(nombrePais).subscribe(message => {
        expect(message).toBe('País eliminado');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes(`/api/v1/paises/${nombrePais}`));
      expect(req.request.method).toBe('DELETE');

      req.flush({ ok: true, message: 'País eliminado' });
    });

    it('deve DELETE a /paises/:nombre y extraer result.message en V2', (done) => {
      service.setVersion('v2');

      const mockV2Response: ApiResponseV2<any> = {
        success: true,
        result: {
          deleted_country: { nombre: nombrePais, continente: 'Europa', poblacion: 1000000 },
          deleted_at: new Date().toISOString(),
          version: '2.0',
          message: 'País eliminado'
        }
      };

      service.eliminarPais(nombrePais).subscribe(message => {
        expect(message).toBe('País eliminado');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes(`/api/v2/paises/${nombrePais}`));
      expect(req.request.method).toBe('DELETE');

      req.flush(mockV2Response);
    });

    it('deve usar message directo si result.message no existe en V2', (done) => {
      service.setVersion('v2');

      const mockResponse: ApiResponseV2<any> = {
        success: true,
        message: 'Eliminado correctamente',
        result: { deleted_country: { nombre: nombrePais } }
      };

      service.eliminarPais(nombrePais).subscribe(message => {
        expect(message).toBe('Eliminado correctamente');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes(`/api/v2/paises/${nombrePais}`));
      req.flush(mockResponse);
    });

    it('deve codificar correctamente el nombre en la URL', (done) => {
      const nombreConEspacio = 'Pais Con Espacio';
      const nombreCodificado = encodeURIComponent(nombreConEspacio);

      service.eliminarPais(nombreConEspacio).subscribe(() => done());

      const req = httpMock.expectOne(req =>
        req.url.includes(nombreCodificado)
      );

      req.flush({ ok: true, message: 'País eliminado' });
    });

    it('deve retornar fallback si no hay message', (done) => {
      service.eliminarPais(nombrePais).subscribe(message => {
        expect(message).toBe('País eliminado');
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes(`/api/v1/paises/${nombrePais}`));
      req.flush({ ok: true }); // Sin message
    });

    it('debe manejar errores HTTP', (done) => {
      service.eliminarPais(nombrePais).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(req => req.url.includes(`/api/v1/paises/${nombrePais}`));
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPaisesByContinente()', () => {
    const continente = 'Europa';
    const mockPaisesEuropa: Pais[] = [
      { nombre: 'España', continente: 'Europa', poblacion: 47000000, pib_2019: 30000, pib_2020: 29000 },
      { nombre: 'Francia', continente: 'Europa', poblacion: 67000000, pib_2019: 40000, pib_2020: 39000 }
    ];

    it('deve estar disponible solo en V2', (done) => {
      // En V1 debe retornar array vacío
      const consoleWarnSpy = spyOn(console, 'warn');

      service.getPaisesByContinente(continente).subscribe(paises => {
        expect(paises).toEqual([]);
        expect(consoleWarnSpy).toHaveBeenCalledWith('Búsqueda por continente solo disponible en V2');
        done();
      });
    });

    it('deve llamar endpoint correcto en V2 y extraer countries', (done) => {
      service.setVersion('v2');

      const mockV2Response: ApiResponseV2<any> = {
        success: true,
        result: {
          continent: continente,
          countries: mockPaisesEuropa,
          count: mockPaisesEuropa.length,
          pagination: { limit: 10, offset: 0 },
          version: '2.0'
        }
      };

      service.getPaisesByContinente(continente).subscribe(paises => {
        expect(paises).toEqual(mockPaisesEuropa);
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url.includes(`/api/v2/paises/continente/${continente}`) &&
        req.params.get('limit') === '10' &&
        req.params.get('offset') === '0'
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockV2Response);
    });

    it('deve pasar continente, limit y offset correctamente', (done) => {
      service.setVersion('v2');

      service.getPaisesByContinente('Asia', 20, 5).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url.includes('continente/Asia') &&
        req.params.get('limit') === '20' &&
        req.params.get('offset') === '5'
      );

      req.flush({
        success: true,
        result: { countries: [], count: 0, pagination: {}, version: '2.0' }
      });
    });

    it('deve extraer result.countries correctamente', (done) => {
      service.setVersion('v2');

      const mockResponse: ApiResponseV2<any> = {
        success: true,
        result: {
          continent: 'America',
          countries: mockPaises,
          count: mockPaises.length,
          pagination: {},
          version: '2.0'
        }
      };

      service.getPaisesByContinente('America').subscribe(paises => {
        expect(paises).toEqual(mockPaises);
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes('continente/America'));
      req.flush(mockResponse);
    });

    it('deve usar array vacío si countries no existe', (done) => {
      service.setVersion('v2');

      const mockResponse: ApiResponseV2<any> = {
        success: true,
        result: {
          continent: 'Antartida',
          count: 0,
          pagination: {},
          version: '2.0'
        }
      };

      service.getPaisesByContinente('Antartida').subscribe(paises => {
        expect(paises).toEqual([]);
        done();
      });

      const req = httpMock.expectOne(req => req.url.includes('continente/Antartida'));
      req.flush(mockResponse);
    });

    it('debe manejar errores HTTP', (done) => {
      service.setVersion('v2');

      service.getPaisesByContinente(continente).subscribe({
        next: () => fail('Debería haber fallado'),
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne(req => req.url.includes('continente/Europa'));
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('Integración de versiones', () => {
    it('debe cambiar correctamente entre V1 y V2', (done) => {
      let completed = 0;
      const checkDone = () => {
        completed++;
        if (completed === 3) done();
      };

      // V1
      service.getPaises().subscribe(() => checkDone());
      const req1 = httpMock.expectOne(req => req.url.includes('/api/v1/paises'));
      req1.flush({ ok: true, data: [] });

      // Cambiar a V2
      service.setVersion('v2');

      service.getPaises().subscribe(() => checkDone());
      const req2 = httpMock.expectOne(req => req.url.includes('/api/v2/paises'));
      req2.flush({
        success: true,
        result: { countries: [], pagination: {}, timestamp: '', version: '2.0' }
      });

      // Volver a V1
      service.setVersion('v1');

      service.getPaises().subscribe(() => checkDone());
      const req3 = httpMock.expectOne(req => req.url.includes('/api/v1/paises'));
      req3.flush({ ok: true, data: [] });
    });

    it('deve mantener consistencia en llamadas múltiples', (done) => {
      service.setVersion('v2');

      let completed = 0;
      const checkDone = () => {
        completed++;
        if (completed === 3) done();
      };

      // Tres llamadas deben usar V2
      service.getPaises().subscribe(() => checkDone());
      const req1 = httpMock.expectOne(req => req.url.includes('/api/v2/paises'));
      req1.flush({ success: true, result: { countries: [], pagination: {}, timestamp: '', version: '2.0' } });

      service.crearPais(mockPaises[0]).subscribe(() => checkDone());
      const req2 = httpMock.expectOne(req => req.url.includes('/api/v2/paises'));
      req2.flush({ success: true, result: { country: mockPaises[0], created_at: '', version: '2.0' } });

      service.eliminarPais('Test').subscribe(() => checkDone());
      const req3 = httpMock.expectOne(req => req.url.includes('/api/v2/paises/Test'));
      req3.flush({ success: true, result: { deleted_country: {}, deleted_at: '', version: '2.0' } });
    });
  });
});
