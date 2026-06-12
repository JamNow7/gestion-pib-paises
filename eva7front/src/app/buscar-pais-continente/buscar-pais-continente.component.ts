import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CountriesService, Pais } from '../services/countries.services';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-buscar-pais-continente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './buscar-pais-continente.component.html',
  styleUrl: './buscar-pais-continente.component.scss'
})
export class BuscarPaisContinenteComponent {
  private fb = inject(FormBuilder);
  private countriesService = inject(CountriesService);

  searchForm: FormGroup = this.fb.group({
    continente: ['']
  });

  paisesEncontrados: Pais[] = [];
  noResultados = false;
  displayedColumns: string[] = ['nombre', 'continente', 'poblacion'];

  onSubmit() {
    if (this.searchForm.invalid) return;

    const continente = this.searchForm.value.continente?.trim();
    if (!continente) return;

    this.countriesService.getPaisesByContinente(continente).subscribe({
      next: (paises) => {
        this.paisesEncontrados = paises;
        this.noResultados = paises.length === 0;
      },
      error: (err) => {
        console.error('Error en búsqueda:', err);
        this.paisesEncontrados = [];
        this.noResultados = true;
      }
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.paisesEncontrados = [];
    this.noResultados = false;
  }

  get version() {
    return this.countriesService.getVersion();
  }

  getFlagCode(nombre: string): string {
    let nombreLower = nombre.toLowerCase();
    nombreLower = nombreLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (nombreLower.includes('esp')) {
      return 'es';
    }

    const flagMap: { [key: string]: string } = {
      'luxemburgo': 'lu',
      'suiza': 'ch',
      'noruega': 'no',
      'suecia': 'se',
      'holanda': 'nl',
      'finlandia': 'fi',
      'alemania': 'de',
      'espana': 'es',
      'españa': 'es',
      'spain': 'es',
      'francia': 'fr',
      'france': 'fr',
      'reino unido': 'gb',
      'united kingdom': 'gb',
      'uk': 'gb',
      'italia': 'it',
      'italy': 'it',
      'rusia': 'ru',
      'russia': 'ru',
      'ucrania': 'ua',
      'ukraine': 'ua',
      'polonia': 'pl',
      'poland': 'pl',
      'belgica': 'be',
      'belgium': 'be',
      'austria': 'at',
      'dinamarca': 'dk',
      'denmark': 'dk',
      'grecia': 'gr',
      'greece': 'gr',
      'portugal': 'pt',
      'irlanda': 'ie',
      'ireland': 'ie',
      'islandia': 'is',
      'iceland': 'is',
      'estados unidos': 'us',
      'united states': 'us',
      'usa': 'us',
      'canada': 'ca',
      'mexico': 'mx',
      'brasil': 'br',
      'argentina': 'ar',
      'colombia': 'co',
      'peru': 'pe',
      'perú': 'pe',
      'chile': 'cl',
      'venezuela': 've',
      'ecuador': 'ec',
      'guatemala': 'gt',
      'bolivia': 'bo',
      'paraguay': 'py',
      'uruguay': 'uy',
      'costa rica': 'cr',
      'panama': 'pa',
      'cuba': 'cu',
      'haiti': 'ht',
      'republica dominicana': 'do',
      'honduras': 'hn',
      'el salvador': 'sv',
      'nicaragua': 'ni',
      'jamaica': 'jm',
      'china': 'cn',
      'india': 'in',
      'japon': 'jp',
      'corea del sur': 'kr',
      'south korea': 'kr',
      'indonesia': 'id',
      'turquia': 'tr',
      'turkey': 'tr',
      'arabia saudi': 'sa',
      'saudi arabia': 'sa',
      'iran': 'ir',
      'irak': 'iq',
      'iraq': 'iq',
      'pakistán': 'pk',
      'pakistan': 'pk',
      'bangladesh': 'bd',
      'filipinas': 'ph',
      'vietnam': 'vn',
      'tailandia': 'th',
      'thailand': 'th',
      'egipto': 'eg',
      'egypt': 'eg',
      'sudafrica': 'za',
      'south africa': 'za',
      'nigeria': 'ng',
      'etiopia': 'et',
      'kenia': 'ke',
      'tanzania': 'tz',
      'uganda': 'ug',
      'ghana': 'gh',
      'australia': 'au',
      'nueva zelanda': 'nz',
      'new zealand': 'nz',
      'fiji': 'fj'
    };

    return flagMap[nombreLower] || 'un';
  }

  getFlagPath(nombre: string): string {
    const code = this.getFlagCode(nombre);
    return `${code}.svg`;
  }
}