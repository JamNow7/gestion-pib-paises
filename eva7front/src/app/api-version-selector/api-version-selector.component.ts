import { Component, inject } from '@angular/core';
import { CountriesService } from '../services/countries.services';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-api-version-selector',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './api-version-selector.component.html',
  styleUrl: './api-version-selector.component.scss'
})
export class ApiVersionSelectorComponent {
  private countriesService = inject(CountriesService);
  currentVersion = this.countriesService.getVersion();

  switchVersion(version: 'v1' | 'v2') {
    this.countriesService.setVersion(version);
    this.currentVersion = version;
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  resetToDefault() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('api_version');
    }
    this.countriesService.setVersion('v1');
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}