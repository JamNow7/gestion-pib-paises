/**
 * Tests unitarios para CrearPaisComponent
 * Prueba formulario de creación, validaciones y manejo de errores
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CrearPaisComponent } from './crear-pais.component';
import { CountriesService, Pais } from '../services/countries.services';

describe('CrearPaisComponent', () => {
  let component: CrearPaisComponent;
  let fixture: ComponentFixture<CrearPaisComponent>;
  let mockCountriesService: jasmine.SpyObj<CountriesService>;

  beforeEach(async () => {
    // Crear spy del servicio
    mockCountriesService = jasmine.createSpyObj('CountriesService', [
      'crearPais'
    ]);

    // Configurar retorno por defecto
    mockCountriesService.crearPais.and.returnValue(of('País creado'));

    await TestBed.configureTestingModule({
      imports: [
        CrearPaisComponent,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: CountriesService, useValue: mockCountriesService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPaisComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Formulario', () => {
    it('debe inicializar formulario con 5 campos', () => {
      const controls = component.form.controls;
      expect(Object.keys(controls).length).toBe(5);
    });

    it('debe tener campo nombre', () => {
      const nombreControl = component.form.get('nombre');
      expect(nombreControl).toBeDefined();
    });

    it('debe tener campo continente', () => {
      const continenteControl = component.form.get('continente');
      expect(continenteControl).toBeDefined();
    });

    it('deve tener campo poblacion', () => {
      const poblacionControl = component.form.get('poblacion');
      expect(poblacionControl).toBeDefined();
    });

    it('deve tener campo pib_2019', () => {
      const pib2019Control = component.form.get('pib_2019');
      expect(pib2019Control).toBeDefined();
    });

    it('deve tener campo pib_2020', () => {
      const pib2020Control = component.form.get('pib_2020');
      expect(pib2020Control).toBeDefined();
    });

    it('debe tener campos requeridos con validadores', () => {
      const nombreControl = component.form.get('nombre');
      const continenteControl = component.form.get('continente');
      const poblacionControl = component.form.get('poblacion');
      const pib2019Control = component.form.get('pib_2019');
      const pib2020Control = component.form.get('pib_2020');

      expect(nombreControl?.valid).toBeFalse();
      expect(continenteControl?.valid).toBeFalse();
      expect(poblacionControl?.valid).toBeFalse();
      expect(pib2019Control?.valid).toBeFalse();
      expect(pib2020Control?.valid).toBeFalse();
    });

    it('debe tener errorCrearBackend vacío inicialmente', () => {
      expect(component.errorCrearBackend).toBe('');
    });
  });

  describe('Validaciones', () => {
    it('debe ser invalido si campos faltan', () => {
      expect(component.form.invalid).toBeTrue();
    });

    it('debe ser invalido si solo nombre está presente', () => {
      component.form.patchValue({ nombre: 'Test' });
      expect(component.form.invalid).toBeTrue();
    });

    it('debe ser invalido si faltan campos numéricos', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa'
      });
      expect(component.form.invalid).toBeTrue();
    });

    it('debe ser válido con todos los campos', () => {
      component.form.patchValue({
        nombre: 'TestPais',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });
      expect(component.form.valid).toBeTrue();
    });

    it('deve requerir nombre no vacío', () => {
      const nombreControl = component.form.get('nombre');
      nombreControl?.setValue('');
      expect(nombreControl?.invalid).toBeTrue();
    });

    it('deve requerir continente no vacío', () => {
      const continenteControl = component.form.get('continente');
      continenteControl?.setValue('');
      expect(continenteControl?.invalid).toBeTrue();
    });

    it('deve requerir poblacion', () => {
      const poblacionControl = component.form.get('poblacion');
      expect(poblacionControl?.invalid).toBeTrue();
    });

    it('deve requerir pib_2019', () => {
      const pib2019Control = component.form.get('pib_2019');
      expect(pib2019Control?.invalid).toBeTrue();
    });

    it('deve requerir pib_2020', () => {
      const pib2020Control = component.form.get('pib_2020');
      expect(pib2020Control?.invalid).toBeTrue();
    });

    it('deve aceptar valores numéricos válidos', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Asia',
        poblacion: 5000000,
        pib_2019: 40000,
        pib_2020: 41000
      });
      expect(component.form.valid).toBeTrue();
    });

    it('deve aceptar cero como valor válido', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Asia',
        poblacion: 0,
        pib_2019: 0,
        pib_2020: 0
      });
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('no debe hacer nada si formulario es invalido', () => {
      component.form.patchValue({ nombre: 'Test' });

      component.onSubmit();

      expect(mockCountriesService.crearPais).not.toHaveBeenCalled();
    });

    it('debe limpiar errorCrearBackend antes de enviar', () => {
      component.errorCrearBackend = 'Error previo';
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(component.errorCrearBackend).toBe('');
    });

    it('debe convertir valores a números correctamente', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: '1000000' as any,
        pib_2019: '30000' as any,
        pib_2020: '31000' as any
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(mockCountriesService.crearPais).toHaveBeenCalledWith({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });
    });

    it('debe llamar countriesService.crearPais con datos correctos', () => {
      const datosPais = {
        nombre: 'NuevoPais',
        continente: 'America',
        poblacion: 5000000,
        pib_2019: 40000,
        pib_2020: 41000
      };

      component.form.patchValue(datosPais);

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(mockCountriesService.crearPais).toHaveBeenCalledWith(
        jasmine.objectContaining(datosPais)
      );
    });

    it('debe resetear formulario en éxito', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(component.form.pristine).toBeTrue();
      expect(component.form.value).toEqual({
        nombre: null,
        continente: null,
        poblacion: null,
        pib_2019: null,
        pib_2020: null
      });
    });

    it('deve setear errorCrearBackend en caso de error', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      const errorResponse = { error: { message: 'Error al crear' } };
      mockCountriesService.crearPais.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.errorCrearBackend).toBe('Error al crear');
    });

    it('deve manejar error con propiedad error.mensaje', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      const errorResponse = { error: { mensaje: 'Mensaje de error' } };
      mockCountriesService.crearPais.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.errorCrearBackend).toBe('Mensaje de error');
    });

    it('deve manejar error con propiedad message directa', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      const errorResponse = { message: 'Error directo' };
      mockCountriesService.crearPais.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.errorCrearBackend).toBe('Error directo');
    });

    it('deve usar mensaje por defecto si no hay info de error', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      mockCountriesService.crearPais.and.returnValue(throwError(() => ({})));

      component.onSubmit();

      expect(component.errorCrearBackend).toBe('Error al crear el país');
    });

    it('deve manejar string vacío en valores', () => {
      component.form.patchValue({
        nombre: '',
        continente: '',
        poblacion: '' as any,
        pib_2019: '' as any,
        pib_2020: '' as any
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      // Formulario invalido, no debe llamar al servicio
      expect(mockCountriesService.crearPais).not.toHaveBeenCalled();
    });

    it('deve manejar null en valores numéricos', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: null,
        pib_2019: null,
        pib_2020: null
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      // Formulario invalido (null no es válido)
      expect(mockCountriesService.crearPais).not.toHaveBeenCalled();
    });
  });

  describe('Casos edge', () => {
    it('deve manejar nombre con espacios', () => {
      component.form.patchValue({
        nombre: 'Pais Con Espacios',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(mockCountriesService.crearPais).toHaveBeenCalledWith(
        jasmine.objectContaining({ nombre: 'Pais Con Espacios' })
      );
    });

    it('deve manejar continente con espacios', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'America del Sur',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(mockCountriesService.crearPais).toHaveBeenCalledWith(
        jasmine.objectContaining({ continente: 'America del Sur' })
      );
    });

    it('deve manejar valores numéricos negativos', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: -100,
        pib_2019: -50,
        pib_2020: -60
      });

      // El formulario es válido (solo required, no min)
      expect(component.form.valid).toBeTrue();

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(mockCountriesService.crearPais).toHaveBeenCalledWith(
        jasmine.objectContaining({
          poblacion: -100,
          pib_2019: -50,
          pib_2020: -60
        })
      );
    });

    it('deve manejar valores decimales', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000.5,
        pib_2019: 30000.7,
        pib_2020: 31000.3
      });

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      component.onSubmit();

      expect(mockCountriesService.crearPais).toHaveBeenCalledWith(
        jasmine.objectContaining({
          poblacion: 1000000.5,
          pib_2019: 30000.7,
          pib_2020: 31000.3
        })
      );
    });
  });

  describe('Integración de formulario', () => {
    it('deve permitir crear, enviar, resetear, y crear nuevo', () => {
      const pais1 = {
        nombre: 'Pais1',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      };

      mockCountriesService.crearPais.and.returnValue(of('País creado'));

      // Primer envío
      component.form.patchValue(pais1);
      component.onSubmit();
      expect(mockCountriesService.crearPais).toHaveBeenCalledTimes(1);

      // Verificar reset
      expect(component.form.pristine).toBeTrue();

      // Segundo envío
      const pais2 = { ...pais1, nombre: 'Pais2' };
      component.form.patchValue(pais2);
      component.onSubmit();
      expect(mockCountriesService.crearPais).toHaveBeenCalledTimes(2);
    });

    it('deve manejar error y luego éxito', () => {
      component.form.patchValue({
        nombre: 'Test',
        continente: 'Europa',
        poblacion: 1000000,
        pib_2019: 30000,
        pib_2020: 31000
      });

      // Primer intento falla
      mockCountriesService.crearPais.and.returnValue(
        throwError(() => ({ error: { message: 'Error' } }))
      );
      component.onSubmit();
      expect(component.errorCrearBackend).toBe('Error');

      // Segundo intento exitoso
      mockCountriesService.crearPais.and.returnValue(of('País creado'));
      component.onSubmit();
      expect(component.errorCrearBackend).toBe('');
      expect(component.form.pristine).toBeTrue();
    });
  });
});
