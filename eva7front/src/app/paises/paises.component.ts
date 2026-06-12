import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CountriesService, Pais } from '../services/countries.services';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-paises',
  standalone: true,
  imports: [
    NgIf, AsyncPipe, CommonModule,
    MatCardModule, MatTableModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule,
    MatToolbarModule, MatInputModule
  ],
  templateUrl: './paises.component.html',
  styleUrl: './paises.component.scss'
})
export class PaisesComponent {
  private countriesService = inject(CountriesService);
  limit = 10;
  offset = 0;
  paises$: Observable<Pais[]> = this.countriesService.getPaises(this.limit, this.offset);
  errorBackend: string = '';
  displayedColumns: string[] = ['nombre', 'continente', 'poblacion', 'pib_2019', 'pib_2020', 'acciones'];

  setLimit(n: number) {
    this.limit = n;
    this.offset = 0;
    this.paises$ = this.countriesService.getPaises(this.limit, this.offset);
  }

  siguiente() {
    this.offset += this.limit;
    this.paises$ = this.countriesService.getPaises(this.limit, this.offset);
  }

  anterior() {
    this.offset = Math.max(0, this.offset - this.limit);
    this.paises$ = this.countriesService.getPaises(this.limit, this.offset);
  }

  actualizar() {
    this.paises$ = this.countriesService.getPaises(this.limit, this.offset);
  }

  eliminarPais(nombre: string) {
    const confirmar = window.confirm(`¿Seguro que deseas eliminar ${nombre}?`);
    if (!confirmar) return;

    this.errorBackend = '';

    this.countriesService.eliminarPais(nombre).subscribe({
      next: () => {
        this.paises$ = this.countriesService.getPaises(this.limit, this.offset);
      },
      error: (err: any) => {
        this.errorBackend =
          err?.error?.message ||
          err?.error?.mensaje ||
          err?.message ||
          'Error al eliminar el país';
      }
    });
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
      'espa': 'es',
      'espa~a': 'es',
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
      'belarus': 'by',
      'bielorrusia': 'by',
      'moldavia': 'md',
      'moldova': 'md',
      'georgia': 'ge',
      'armenia': 'am',
      'azerbaiyan': 'az',
      'azerbaijan': 'az',
      'kazajistan': 'kz',
      'kazakhstan': 'kz',
      'uzbekistan': 'uz',
      'kirguistan': 'kg',
      'kyrgyzstan': 'kg',
      'tayikistan': 'tj',
      'tajikistan': 'tj',
      'turkmenistan': 'tm',

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
      'dominican republic': 'do',
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
      'myanmar': 'mm',
      'birmania': 'mm',
      'camboya': 'kh',
      'cambodia': 'kh',
      'laos': 'la',
      'nepal': 'np',
      'butan': 'bt',
      'bhutan': 'bt',
      'sri lanka': 'lk',
      'maldivas': 'mv',
      'maldives': 'mv',
      'mongolia': 'mn',
      'singapur': 'sg',
      'singapore': 'sg',
      'malasia': 'my',
      'malaysia': 'my',
      'brunei': 'bn',
      'timor oriental': 'tl',
      'timor leste': 'tl',
      'palestina': 'ps',
      'israel': 'il',
      'jordania': 'jo',
      'jordan': 'jo',
      'libano': 'lb',
      'lebanon': 'lb',
      'siria': 'sy',
      'kuwait': 'kw',
      'qatar': 'qa',
      'emiratos arabes unidos': 'ae',
      'united arab emirates': 'ae',
      'omán': 'om',
      'yemen': 'ye',

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
      'costa de marfil': 'ci',
      'senegal': 'sn',
      'mali': 'ml',
      'niger': 'ne',
      'chad': 'td',
      'marruecos': 'ma',
      'tunez': 'tn',
      'argelia': 'dz',
      'libia': 'ly',
      'sudan': 'sd',
      'camerun': 'cm',
      ' RD del congo': 'cd',
      'congo': 'cg',
      'zimbabwe': 'zw',
      'mozambique': 'mz',
      'angola': 'ao',
      'botswana': 'bw',
      'namibia': 'na',
      'zambia': 'zm',
      'malawi': 'mw',
      'madagascar': 'mg',
      'somalia': 'so',
      'eritrea': 'er',

      'australia': 'au',
      'nueva zelanda': 'nz',
      'new zealand': 'nz',
      'fiji': 'fj',
      'papua nueva guinea': 'pg',
      'papua new guinea': 'pg',
      'solomon islands': 'sb',
      'vanuatu': 'vu',
      'samoa': 'ws',
      'tonga': 'to',

      'un': 'un',
      'onu': 'un'
    };

    const code = flagMap[nombreLower] || 'un';
    return code;
  }

  getFlagPath(nombre: string): string {
    const code = this.getFlagCode(nombre);
    return `${code}.svg`;
  }
}