import { Component } from '@angular/core';
import { PaisesComponent } from './paises/paises.component';
import { CrearPaisComponent } from './crear-pais/crear-pais.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaisesComponent, CrearPaisComponent, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'eva7front';
}