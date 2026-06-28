/**
 * Tests unitarios para BuscarPaisContinenteComponent
 * Prueba búsqueda por continente, manejo de resultados y errores
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BuscarPaisContinenteComponent } from './buscar-pais-continente.component';
import { CountriesService, Pais } from '../services/countries.services';

describe('BuscarPaisContinenteComponent', () => {
  let component: BuscarPaisContinenteComponent;
  let fixture: ComponentFixture<BuscarPaisContinenteComponent>;
  let mockCountriesService: jasmine.SpyObj<CountriesService>;

  const mockPaisesEuropa: Pais[] = [
    { nombre: 'España', continente: 'Europa', poblacion: 47000000, pib_2019: 30000, pib_2020: 29000 },
    { nombre: 'Francia', continente: 'Europa', poblacion: 67000000, pib_2019: 40000, pib_2020: 39000 }
  ];

  beforeEach(async () => {
    // Crear spy del servicio
    mockCountriesService = jasmine.createSpyObj('CountriesService', [
      'getPaisesByContinente',
      'getVersion'
    ]);

    // Configurar retornos por defecto
    mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));
    mockCountriesService.getVersion.and.returnValue('v1');

    await TestBed.configureTestingModule({
      imports: [
        BuscarPaisContinenteComponent,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: CountriesService, useValue: mockCountriesService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarPaisContinenteComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debe tener searchForm inicializado', () => {
      expect(component.searchForm).toBeDefined();
    });

    it('debe tener campo continente en el formulario', () => {
      const continenteControl = component.searchForm.get('continente');
      expect(continenteControl).toBeDefined();
    });

    it('deve tener paisesEncontrados vacío inicialmente', () => {
      expect(component.paisesEncontrados).toEqual([]);
    });

    it('deve tener noResultados en false inicialmente', () => {
      expect(component.noResultados).toBeFalse();
    });

    it('deve tener displayedColumns con 3 columnas', () => {
      expect(component.displayedColumns).toEqual(['nombre', 'continente', 'poblacion']);
    });
  });

  describe('onSubmit', () => {
    it('no debe hacer nada si formulario es invalido', () => {
      component.searchForm.patchValue({ continente: '' });

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).not.toHaveBeenCalled();
    });

    it('no debe hacer nada si continente está vacío', () => {
      component.searchForm.patchValue({ continente: '' });

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).not.toHaveBeenCalled();
    });

    it('no debe hacer nada si continente es solo espacios', () => {
      component.searchForm.patchValue({ continente: '   ' });

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).not.toHaveBeenCalled();
    });

    it('debe llamar servicio con continente correcto', () => {
      component.searchForm.patchValue({ continente: 'Europa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).toHaveBeenCalledWith('Europa');
    });

    it('debe hacer trim del continente antes de llamar servicio', () => {
      component.searchForm.patchValue({ continente: '  Europa  ' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).toHaveBeenCalledWith('Europa');
    });

    it('debe asignar resultados a paisesEncontrados', () => {
      component.searchForm.patchValue({ continente: 'Europa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));

      component.onSubmit();

      expect(component.paisesEncontrados).toEqual(mockPaisesEuropa);
    });

    it('debe setear noResultados a false si hay resultados', () => {
      component.searchForm.patchValue({ continente: 'Europa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));

      component.onSubmit();

      expect(component.noResultados).toBeFalse();
    });

    it('debe setear noResultados a true si array vacío', () => {
      component.searchForm.patchValue({ continente: 'Antartida' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of([]));

      component.onSubmit();

      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeTrue();
    });

    it('deve manejar error de API', () => {
      const consoleErrorSpy = spyOn(console, 'error');

      component.searchForm.patchValue({ continente: 'Europa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(
        throwError(() => new Error('Error de API'))
      );

      component.onSubmit();

      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeTrue();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('deve manejar error con objeto de error', () => {
      spyOn(console, 'error');

      component.searchForm.patchValue({ continente: 'Europa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(
        throwError(() => ({ error: { message: 'Error específico' } }))
      );

      component.onSubmit();

      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeTrue();
    });
  });

  describe('clearSearch', () => {
    it('debe resetear el formulario', () => {
      component.searchForm.patchValue({ continente: 'Europa' });
      component.paisesEncontrados = mockPaisesEuropa;
      component.noResultados = true;

      component.clearSearch();

      expect(component.searchForm.pristine).toBeTrue();
      // El formulario reset puede tener null o string vacío
      expect(component.searchForm.value.continente).toBeFalsy();
    });

    it('debe vaciar paisesEncontrados', () => {
      component.paisesEncontrados = mockPaisesEuropa;

      component.clearSearch();

      expect(component.paisesEncontrados).toEqual([]);
    });

    it('debe setear noResultados a false', () => {
      component.noResultados = true;

      component.clearSearch();

      expect(component.noResultados).toBeFalse();
    });

    it('deve estar disponible después de una búsqueda', () => {
      // Primero hacer una búsqueda
      component.searchForm.patchValue({ continente: 'Europa' });
      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));
      component.onSubmit();

      expect(component.paisesEncontrados.length).toBeGreaterThan(0);

      // Limpiar
      component.clearSearch();

      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeFalse();
    });
  });

  describe('get version', () => {
    it('deve retornar versión del servicio', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      const version = component.version;

      expect(version).toBe('v1');
      expect(mockCountriesService.getVersion).toHaveBeenCalled();
    });

    it('deve retornar v2 cuando servicio está en v2', () => {
      mockCountriesService.getVersion.and.returnValue('v2');

      const version = component.version;

      expect(version).toBe('v2');
    });
  });

  describe('Utilidades - getFlagCode', () => {
    it('deve retornar código correcto para países conocidos', () => {
      expect(component.getFlagCode('España')).toBe('es');
      expect(component.getFlagCode('France')).toBe('fr');
      expect(component.getFlagCode('Argentina')).toBe('ar');
    });

    it('deve ser case-insensitive', () => {
      expect(component.getFlagCode('ESPAÑA')).toBe('es');
      expect(component.getFlagCode('france')).toBe('fr');
    });

    it('deve manejar acentos', () => {
      expect(component.getFlagCode('España')).toBe('es');
      expect(component.getFlagCode('Perú')).toBe('pe');
    });

    it('deve retornar "un" para país desconocido', () => {
      expect(component.getFlagCode('PaisDesconocido')).toBe('un');
    });

    it('deve detectar "esp" substring', () => {
      expect(component.getFlagCode('españa')).toBe('es');
    });
  });

  describe('Utilidades - getFlagPath', () => {
    it('deve retornar path con código + .svg', () => {
      expect(component.getFlagPath('España')).toBe('es.svg');
      expect(component.getFlagPath('France')).toBe('fr.svg');
    });

    it('deve ser consistente con getFlagCode', () => {
      const codigo = component.getFlagCode('España');
      const path = component.getFlagPath('España');
      expect(path).toBe(`${codigo}.svg`);
    });
  });

  describe('Casos edge', () => {
    it('deve manejar continente con espacios', () => {
      component.searchForm.patchValue({ continente: 'America del Sur' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of([]));

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).toHaveBeenCalledWith('America del Sur');
    });

    it('deve manejar continente con mayúsculas/minúsculas', () => {
      component.searchForm.patchValue({ continente: 'euROpa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).toHaveBeenCalledWith('euROpa');
    });

    it('deve manejar continente con caracteres especiales', () => {
      component.searchForm.patchValue({ continente: 'Asia-Oriental' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of([]));

      component.onSubmit();

      expect(mockCountriesService.getPaisesByContinente).toHaveBeenCalledWith('Asia-Oriental');
    });

    it('deve manejar búsqueda después de clear', () => {
      // Primera búsqueda
      component.searchForm.patchValue({ continente: 'Europa' });
      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));
      component.onSubmit();
      expect(component.paisesEncontrados.length).toBe(2);

      // Limpiar
      component.clearSearch();
      expect(component.paisesEncontrados.length).toBe(0);

      // Segunda búsqueda
      component.searchForm.patchValue({ continente: 'America' });
      mockCountriesService.getPaisesByContinente.and.returnValue(of([]));
      component.onSubmit();
      expect(component.noResultados).toBeTrue();
    });

    it('deve manejar servicio retornando null', () => {
      component.searchForm.patchValue({ continente: 'Europa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of(null as any));

      component.onSubmit();

      // El código de producción maneja null y lo convierte a []
      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeTrue();
    });

    it('deve manejar servicio retornando undefined', () => {
      component.searchForm.patchValue({ continente: 'Europa' });

      mockCountriesService.getPaisesByContinente.and.returnValue(of(undefined as any));

      component.onSubmit();

      // El código de producción maneja undefined y lo convierte a []
      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeTrue();
    });
  });

  describe('Integración', () => {
    it('deve permitir flujo completo: buscar -> ver resultados -> limpiar', () => {
      // Buscar
      component.searchForm.patchValue({ continente: 'Europa' });
      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));
      component.onSubmit();

      expect(component.paisesEncontrados).toEqual(mockPaisesEuropa);
      expect(component.noResultados).toBeFalse();

      // Limpiar
      component.clearSearch();

      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeFalse();
      expect(component.searchForm.pristine).toBeTrue();
    });

    it('deve permitir múltiples búsquedas en secuencia', () => {
      // Primera búsqueda
      component.searchForm.patchValue({ continente: 'Europa' });
      mockCountriesService.getPaisesByContinente.and.returnValue(of(mockPaisesEuropa));
      component.onSubmit();

      expect(component.paisesEncontrados.length).toBe(2);

      // Segunda búsqueda
      component.searchForm.patchValue({ continente: 'Asia' });
      mockCountriesService.getPaisesByContinente.and.returnValue(of([]));
      component.onSubmit();

      expect(component.paisesEncontrados).toEqual([]);
      expect(component.noResultados).toBeTrue();
    });
  });
});
