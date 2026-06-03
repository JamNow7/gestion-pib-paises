import { Component } from '@angular/core';
import { PaisesComponent } from './paises/paises.component';
import { CrearPaisComponent } from './crear-pais/crear-pais.component';
import { ApiVersionSelectorComponent } from './api-version-selector/api-version-selector.component';
import { BuscarPaisContinenteComponent } from './buscar-pais-continente/buscar-pais-continente.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PaisesComponent,
    CrearPaisComponent,
    ApiVersionSelectorComponent,
    BuscarPaisContinenteComponent,
    MatToolbarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'eva7front';
}