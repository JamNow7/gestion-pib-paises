/**
 * Tests unitarios para PaisesComponent
 * Prueba listado, paginación, eliminación y utilidades de banderas
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PaisesComponent } from './paises.component';
import { CountriesService, Pais } from '../services/countries.services';

describe('PaisesComponent', () => {
  let component: PaisesComponent;
  let fixture: ComponentFixture<PaisesComponent>;
  let mockCountriesService: jasmine.SpyObj<CountriesService>;

  const mockPaises: Pais[] = [
    { nombre: 'España', continente: 'Europa', poblacion: 47000000, pib_2019: 30000, pib_2020: 29000 },
    { nombre: 'Francia', continente: 'Europa', poblacion: 67000000, pib_2019: 40000, pib_2020: 39000 },
    { nombre: 'Argentina', continente: 'America', poblacion: 45000000, pib_2019: 9000, pib_2020: 9700 }
  ];

  beforeEach(async () => {
    // Crear spy del servicio con retornos por defecto
    mockCountriesService = jasmine.createSpyObj('CountriesService', [
      'getPaises',
      'eliminarPais',
      'getVersion'
    ]);

    // Configurar retornos por defecto
    mockCountriesService.getPaises.and.returnValue(of(mockPaises));
    mockCountriesService.eliminarPais.and.returnValue(of('País eliminado'));
    mockCountriesService.getVersion.and.returnValue('v1');

    // Mock window.confirm para todos los tests
    spyOn(window, 'confirm').and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [PaisesComponent],
      providers: [
        { provide: CountriesService, useValue: mockCountriesService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignorar templates de componentes hijos
    }).compileComponents();

    fixture = TestBed.createComponent(PaisesComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debe tener displayedColumns con las 6 columnas correctas', () => {
      expect(component.displayedColumns).toEqual([
        'nombre',
        'continente',
        'poblacion',
        'pib_2019',
        'pib_2020',
        'acciones'
      ]);
    });

    it('debe tener limit inicial de 10', () => {
      expect(component.limit).toBe(10);
    });

    it('deve tener offset inicial de 0', () => {
      expect(component.offset).toBe(0);
    });

    it('debe tener paises$ como Observable inicializado', () => {
      expect(component.paises$).toBeDefined();
      expect(component.paises$).toEqual(jasmine.any(Object));
    });

    it('debe tener errorBackend vacío inicialmente', () => {
      expect(component.errorBackend).toBe('');
    });
  });

  describe('Paginación - setLimit', () => {
    it('debe actualizar limit y resetear offset a 0', () => {
      component.offset = 20; // Offset no cero

      component.setLimit(5);

      expect(component.limit).toBe(5);
      expect(component.offset).toBe(0);
    });

    it('debe actualizar paises$ cuando cambia limit', () => {
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.setLimit(20);

      expect(mockCountriesService.getPaises).toHaveBeenCalledWith(20, 0);
    });

    it('debe permitir diferentes valores de limit', () => {
      component.setLimit(5);
      expect(component.limit).toBe(5);

      component.setLimit(15);
      expect(component.limit).toBe(15);

      component.setLimit(50);
      expect(component.limit).toBe(50);
    });
  });

  describe('Paginación - siguiente', () => {
    it('debe incrementar offset por limit', () => {
      component.limit = 10;
      component.offset = 0;

      component.siguiente();

      expect(component.offset).toBe(10);
    });

    it('debe incrementar correctamente con offset inicial no cero', () => {
      component.limit = 10;
      component.offset = 20;

      component.siguiente();

      expect(component.offset).toBe(30);
    });

    it('debe actualizar paises$ con nuevos parámetros', () => {
      component.limit = 10;
      component.offset = 0;
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.siguiente();

      expect(mockCountriesService.getPaises).toHaveBeenCalledWith(10, 10);
    });
  });

  describe('Paginación - anterior', () => {
    it('debe decrementar offset por limit', () => {
      component.limit = 10;
      component.offset = 20;

      component.anterior();

      expect(component.offset).toBe(10);
    });

    it('no debe hacer offset negativo', () => {
      component.limit = 10;
      component.offset = 5;

      component.anterior();

      expect(component.offset).toBe(0); // Math.max(0, 5-10) = 0
    });

    it('debe mantener offset en 0 si ya es 0', () => {
      component.limit = 10;
      component.offset = 0;

      component.anterior();

      expect(component.offset).toBe(0);
    });

    it('debe actualizar paises$ con nuevos parámetros', () => {
      component.limit = 10;
      component.offset = 20;
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.anterior();

      expect(mockCountriesService.getPaises).toHaveBeenCalledWith(10, 10);
    });
  });

  describe('Actualización', () => {
    it('debe llamar getPaises con mismos parámetros', () => {
      component.limit = 15;
      component.offset = 5;
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.actualizar();

      expect(mockCountriesService.getPaises).toHaveBeenCalledWith(15, 5);
    });

    it('debe mantener limit y offset sin cambios', () => {
      component.limit = 15;
      component.offset = 5;

      component.actualizar();

      expect(component.limit).toBe(15);
      expect(component.offset).toBe(5);
    });
  });

  describe('Eliminación - eliminarPais', () => {
    it('debe mostrar confirmación al usuario', () => {
      component.eliminarPais('España');

      expect(window.confirm).toHaveBeenCalledWith(
        jasmine.stringContaining('España')
      );
      expect(window.confirm).toHaveBeenCalledWith(
        jasmine.stringContaining('¿Seguro que deseas eliminar')
      );
    });

    it('no debe hacer nada si el usuario cancela', () => {
      (window.confirm as jasmine.Spy).and.returnValue(false);

      component.eliminarPais('España');

      expect(mockCountriesService.eliminarPais).not.toHaveBeenCalled();
    });

    it('debe llamar servicio con nombre correcto si confirma', () => {
      mockCountriesService.eliminarPais.and.returnValue(of('País eliminado'));
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.eliminarPais('Francia');

      expect(mockCountriesService.eliminarPais).toHaveBeenCalledWith('Francia');
    });

    it('debe limpiar errorBackend antes de eliminar', () => {
      component.errorBackend = 'Error previo';
      mockCountriesService.eliminarPais.and.returnValue(of('País eliminado'));
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.eliminarPais('España');

      expect(component.errorBackend).toBe('');
    });

    it('debe actualizar lista de países en éxito', () => {
      mockCountriesService.eliminarPais.and.returnValue(of('País eliminado'));
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.eliminarPais('España');

      expect(mockCountriesService.getPaises).toHaveBeenCalled();
    });

    it('deve setear errorBackend en caso de error', () => {
      const errorResponse = { error: { message: 'Error al eliminar' } };
      mockCountriesService.eliminarPais.and.returnValue(throwError(() => errorResponse));

      component.eliminarPais('España');

      expect(component.errorBackend).toBe('Error al eliminar');
    });

    it('deve manejar error con propiedad error.mensaje', () => {
      const errorResponse = { error: { mensaje: 'Mensaje de error' } };
      mockCountriesService.eliminarPais.and.returnValue(throwError(() => errorResponse));

      component.eliminarPais('España');

      expect(component.errorBackend).toBe('Mensaje de error');
    });

    it('deve manejar error con propiedad message directa', () => {
      const errorResponse = { message: 'Error directo' };
      mockCountriesService.eliminarPais.and.returnValue(throwError(() => errorResponse));

      component.eliminarPais('España');

      expect(component.errorBackend).toBe('Error directo');
    });

    it('deve usar mensaje por defecto si no hay info de error', () => {
      mockCountriesService.eliminarPais.and.returnValue(throwError(() => ({})));

      component.eliminarPais('España');

      expect(component.errorBackend).toBe('Error al eliminar el país');
    });
  });

  describe('Utilidades - getFlagCode', () => {
    it('deve retornar código correcto para países conocidos', () => {
      expect(component.getFlagCode('España')).toBe('es');
      expect(component.getFlagCode('españa')).toBe('es');
      expect(component.getFlagCode('France')).toBe('fr');
      expect(component.getFlagCode('United States')).toBe('us');
      expect(component.getFlagCode('Argentina')).toBe('ar');
      expect(component.getFlagCode('Brasil')).toBe('br');
    });

    it('deve ser case-insensitive', () => {
      expect(component.getFlagCode('ESPAÑA')).toBe('es');
      expect(component.getFlagCode('FRANCE')).toBe('fr');
      expect(component.getFlagCode('argentina')).toBe('ar');
    });

    it('deve manejar acentos y caracteres especiales', () => {
      expect(component.getFlagCode('España')).toBe('es');
      expect(component.getFlagCode('Perú')).toBe('pe');
      expect(component.getFlagCode('México')).toBe('mx');
    });

    it('deve retornar "un" para país desconocido', () => {
      expect(component.getFlagCode('PaisDesconocido')).toBe('un');
      expect(component.getFlagCode('XYZ')).toBe('un');
      expect(component.getFlagCode('')).toBe('un');
    });

    it('deve detectar "esp" substring específicamente', () => {
      expect(component.getFlagCode('españa')).toBe('es');
      expect(component.getFlagCode('espana')).toBe('es');
      expect(component.getFlagCode('esperanza')).toBe('es'); // contiene "esp"
    });

    it('deve mapear países específicos correctamente', () => {
      // Europa
      expect(component.getFlagCode('Luxemburgo')).toBe('lu');
      expect(component.getFlagCode('Suiza')).toBe('ch');
      expect(component.getFlagCode('Noruega')).toBe('no');
      expect(component.getFlagCode('Alemania')).toBe('de');

      // América
      expect(component.getFlagCode('Canadá')).toBe('ca');
      expect(component.getFlagCode('México')).toBe('mx');
      expect(component.getFlagCode('Chile')).toBe('cl');

      // Asia
      expect(component.getFlagCode('China')).toBe('cn');
      expect(component.getFlagCode('Japón')).toBe('jp');
      expect(component.getFlagCode('India')).toBe('in');
    });
  });

  describe('Utilidades - getFlagPath', () => {
    it('deve retornar path con código + .svg', () => {
      expect(component.getFlagPath('España')).toBe('es.svg');
      expect(component.getFlagPath('France')).toBe('fr.svg');
      expect(component.getFlagPath('Argentina')).toBe('ar.svg');
    });

    it('deve usar código de bandera derivado', () => {
      expect(component.getFlagPath('PaisDesconocido')).toBe('un.svg');
      expect(component.getFlagPath('Brasil')).toBe('br.svg');
    });

    it('deve ser consistente con getFlagCode', () => {
      const codigo = component.getFlagCode('España');
      const path = component.getFlagPath('España');
      expect(path).toBe(`${codigo}.svg`);
    });
  });

  describe('Integración de paginación', () => {
    it('deve permitir navegación completa: siguiente/anterior', () => {
      component.limit = 10;
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      // Estado inicial
      expect(component.offset).toBe(0);

      // Avanzar
      component.siguiente();
      expect(component.offset).toBe(10);

      // Avanzar más
      component.siguiente();
      expect(component.offset).toBe(20);

      // Retroceder
      component.anterior();
      expect(component.offset).toBe(10);

      // Retroceder al inicio
      component.anterior();
      expect(component.offset).toBe(0);

      // No debe ir negativo
      component.anterior();
      expect(component.offset).toBe(0);
    });

    it('debe resetear navegación cuando cambia limit', () => {
      component.limit = 10;
      component.offset = 30;

      component.setLimit(20);

      expect(component.offset).toBe(0);
    });
  });

  describe('Casos edge', () => {
    it('deve manejar nombre vacío en eliminación', () => {
      mockCountriesService.eliminarPais.and.returnValue(of(''));
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.eliminarPais('');

      expect(mockCountriesService.eliminarPais).toHaveBeenCalledWith('');
    });

    it('deve manejar nombre con espacios en eliminación', () => {
      mockCountriesService.eliminarPais.and.returnValue(of('País eliminado'));
      mockCountriesService.getPaises.and.returnValue(of(mockPaises));

      component.eliminarPais('Pais Con Espacios');

      expect(mockCountriesService.eliminarPais).toHaveBeenCalledWith('Pais Con Espacios');
    });

    it('deve manecar limit de 0', () => {
      component.setLimit(0);

      expect(component.limit).toBe(0);
    });

    it('deve manejar offset negativo si se setea manualmente', () => {
      component.offset = -5;

      component.anterior();

      expect(component.offset).toBe(0); // Math.max(0, -5-10) = 0
    });
  });
});
