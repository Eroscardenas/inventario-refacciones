import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig,  provideBrowserGlobalErrorListeners,  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // usa zoneJS para actualizar la vista después de tareas asíncronas.
    provideZoneChangeDetection(),

    provideRouter(routes),

    // permite consumir la api del backend.
    provideHttpClient(),
  ],
};