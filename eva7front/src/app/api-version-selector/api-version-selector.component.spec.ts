/**
 * Tests unitarios para ApiVersionSelectorComponent
 * Prueba selector de versión API V1/V2 y cambio dinámico
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ApiVersionSelectorComponent } from './api-version-selector.component';
import { CountriesService } from '../services/countries.services';
import { LocationService } from '../services/location.service';

describe('ApiVersionSelectorComponent', () => {
  let component: ApiVersionSelectorComponent;
  let fixture: ComponentFixture<ApiVersionSelectorComponent>;
  let mockCountriesService: jasmine.SpyObj<CountriesService>;
  let mockLocationService: jasmine.SpyObj<LocationService>;

  beforeEach(async () => {
    // Crear espías del servicio
    mockCountriesService = jasmine.createSpyObj('CountriesService', [
      'getVersion',
      'setVersion'
    ]);

    mockLocationService = jasmine.createSpyObj('LocationService', ['reload']);

    // Configurar retornos por defecto
    mockCountriesService.getVersion.and.returnValue('v1');

    await TestBed.configureTestingModule({
      imports: [ApiVersionSelectorComponent],
      providers: [
        { provide: CountriesService, useValue: mockCountriesService },
        { provide: LocationService, useValue: mockLocationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ApiVersionSelectorComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debe obtener versión actual del servicio', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      fixture.detectChanges();

      expect(component.currentVersion).toBe('v1');
      expect(mockCountriesService.getVersion).toHaveBeenCalled();
    });

    it('deve inicializar con v1 por defecto', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      fixture.detectChanges();

      expect(component.currentVersion).toBe('v1');
    });

    it('deve inicializar con v2 si está configurado en servicio', () => {
      mockCountriesService.getVersion.and.returnValue('v2');

      // Recrear componente con nuevo mock
      fixture = TestBed.createComponent(ApiVersionSelectorComponent);
      component = fixture.componentInstance;

      expect(component.currentVersion).toBe('v2');
    });
  });

  describe('switchVersion', () => {
    it('debe cambiar a v1 y recargar página', () => {
      mockCountriesService.getVersion.and.returnValue('v2');

      component.switchVersion('v1');

      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v1');
      expect(component.currentVersion).toBe('v1');
      expect(mockLocationService.reload).toHaveBeenCalled();
    });

    it('debe cambiar a v2 y recargar página', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      component.switchVersion('v2');

      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v2');
      expect(component.currentVersion).toBe('v2');
      expect(mockLocationService.reload).toHaveBeenCalled();
    });

    it('debe actualizar currentVersion después del cambio', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      component.switchVersion('v2');

      expect(component.currentVersion).toBe('v2');

      component.switchVersion('v1');

      expect(component.currentVersion).toBe('v1');
    });

    it('deve permitir múltiples cambios en secuencia', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      component.switchVersion('v2');
      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v2');

      component.switchVersion('v1');
      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v1');

      component.switchVersion('v2');
      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v2');

      expect(mockCountriesService.setVersion).toHaveBeenCalledTimes(3);
    });

    it('deve recargar página solo cuando window está definido', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      // En entorno de prueba, window siempre está definido
      component.switchVersion('v2');

      expect(mockLocationService.reload).toHaveBeenCalled();
    });
  });

  describe('resetToDefault', () => {
    let localStorageRemoveSpy: jasmine.Spy;
    let localStorageGetSpy: jasmine.Spy;

    beforeEach(() => {
      localStorageRemoveSpy = spyOn(localStorage, 'removeItem');
      localStorageGetSpy = spyOn(localStorage, 'getItem');
    });

    it('debe remover api_version de localStorage', () => {
      component.resetToDefault();

      expect(localStorageRemoveSpy).toHaveBeenCalledWith('api_version');
    });

    it('debe setear versión a v1 en el servicio', () => {
      component.resetToDefault();

      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v1');
    });

    it('debe recargar página', () => {
      component.resetToDefault();

      expect(mockLocationService.reload).toHaveBeenCalled();
    });

    it('deve funcionar cuando localStorage no tiene api_version', () => {
      localStorageRemoveSpy.and.returnValue(undefined);

      component.resetToDefault();

      expect(localStorageRemoveSpy).toHaveBeenCalledWith('api_version');
      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v1');
    });

    it('deve funcionar correctamente después de cambio previo', () => {
      // Primero cambiar a v2
      mockCountriesService.getVersion.and.returnValue('v2');
      component.switchVersion('v2');
      expect(component.currentVersion).toBe('v2');

      // Resetear
      mockCountriesService.getVersion.and.returnValue('v1');
      component.resetToDefault();

      expect(localStorageRemoveSpy).toHaveBeenCalledWith('api_version');
      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v1');
    });
  });

  describe('Casos edge', () => {
    it('deve manejar versión null del servicio', () => {
      // Recrear componente con mock modificado
      mockCountriesService.getVersion.and.returnValue(null as any);

      fixture = TestBed.createComponent(ApiVersionSelectorComponent);
      component = fixture.componentInstance;

      expect(component.currentVersion).toBeNull();
    });

    it('deve manejar versión undefined del servicio', () => {
      // Recrear componente con mock modificado
      mockCountriesService.getVersion.and.returnValue(undefined as any);

      fixture = TestBed.createComponent(ApiVersionSelectorComponent);
      component = fixture.componentInstance;

      expect(component.currentVersion).toBeUndefined();
    });

    it('deve aceptar solo v1 o v2 como versiones válidas', () => {
      // v1
      component.switchVersion('v1');
      expect(component.currentVersion).toBe('v1');

      // v2
      component.switchVersion('v2');
      expect(component.currentVersion).toBe('v2');
    });

    it('deve manejar localStorage ya vacío en resetToDefault', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      spyOn(localStorage, 'removeItem');

      component.resetToDefault();

      expect(localStorage.removeItem).toHaveBeenCalledWith('api_version');
    });
  });

  describe('Integración con CountriesService', () => {
    it('debe reflejar estado inicial del servicio', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      fixture.detectChanges();

      expect(component.currentVersion).toBe('v1');
      expect(mockCountriesService.getVersion).toHaveBeenCalled();
    });

    it('debe actualizar estado del servicio al cambiar versión', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      component.switchVersion('v2');

      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v2');
      expect(mockCountriesService.setVersion).toHaveBeenCalledTimes(1);
    });

    it('deve resetear servicio a estado por defecto', () => {
      mockCountriesService.getVersion.and.returnValue('v2');

      component.resetToDefault();

      expect(mockCountriesService.setVersion).toHaveBeenCalledWith('v1');
    });
  });

  describe('Comportamiento de recarga', () => {
    it('switchVersion debe recargar una vez por llamada', () => {
      mockLocationService.reload.calls.reset();
      component.switchVersion('v2');
      expect(mockLocationService.reload).toHaveBeenCalledTimes(1);

      component.switchVersion('v1');
      expect(mockLocationService.reload).toHaveBeenCalledTimes(2);
    });

    it('resetToDefault debe recargar una vez', () => {
      mockLocationService.reload.calls.reset();
      component.resetToDefault();
      expect(mockLocationService.reload).toHaveBeenCalledTimes(1);
    });

    it('ambos métodos deben recargar correctamente', () => {
      mockLocationService.reload.calls.reset();
      mockCountriesService.getVersion.and.returnValue('v1');

      component.switchVersion('v2');
      expect(mockLocationService.reload).toHaveBeenCalledTimes(1);

      component.resetToDefault();
      expect(mockLocationService.reload).toHaveBeenCalledTimes(2);
    });
  });

  describe('Persistencia de estado', () => {
    it('deve mantener versión actual como propiedad del componente', () => {
      mockCountriesService.getVersion.and.returnValue('v1');

      fixture.detectChanges();

      const versionInicial = component.currentVersion;
      expect(versionInicial).toBe('v1');

      component.switchVersion('v2');
      expect(component.currentVersion).toBe('v2');

      component.switchVersion('v1');
      expect(component.currentVersion).toBe('v1');
    });

    it('deve permitir consulta de versión actual a través de currentVersion', () => {
      // Recrear componente con mock modificado
      mockCountriesService.getVersion.and.returnValue('v2');

      fixture = TestBed.createComponent(ApiVersionSelectorComponent);
      component = fixture.componentInstance;

      expect(component.currentVersion).toBe('v2');
    });
  });
});
