import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AuthHttpInterceptor, provideAuth0} from '@auth0/auth0-angular';

import { routes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAuth0({
      domain: 'dev-z0d7qop2x7xnoumm.us.auth0.com',
      clientId: 'uUWtRtWDkqqaghN35R3EkvnTx4OKzwM3',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https.api.bankapp.com',
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: '*',
            tokenOptions: {
              authorizationParams: {
                audience: 'https.api.bankapp.com'
              }
            }
          }
        ]
      }
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    provideAnimations()
  ]
};
