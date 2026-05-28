import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CountriesService } from '../services/countries.services';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-crear-pais',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgIf,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatToolbarModule
  ],
  templateUrl: './crear-pais.component.html',
  styleUrl: './crear-pais.component.scss'
})
export class CrearPaisComponent {
  private fb = inject(FormBuilder);
  private countriesService = inject(CountriesService);
  errorCrearBackend: string = '';

  form = this.fb.group({
    nombre: ['', Validators.required],
    continente: ['', Validators.required],
    poblacion: [null as number | null, Validators.required],
    pib_2019: [null as number | null, Validators.required],
    pib_2020: [null as number | null, Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.errorCrearBackend = '';

    const data = {
      nombre: this.form.value.nombre || '',
      continente: this.form.value.continente || '',
      poblacion: Number(this.form.value.poblacion),
      pib_2019: Number(this.form.value.pib_2019),
      pib_2020: Number(this.form.value.pib_2020)
    };

    this.countriesService.crearPais(data as any).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.form.reset();
      },
      error: (err: any) => {
        console.log('Error del backend:', err);
        this.errorCrearBackend =
          err?.error?.mensaje ||
          err?.error?.message ||
          err?.message ||
          'Error al crear el país';
      }
    });
  }
}