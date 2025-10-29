import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from "@angular/platform-browser/animations";
import {NgxUiLoaderConfig, NgxUiLoaderModule} from "ngx-ui-loader";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  hasProgressBar: false,
  fgsType: "ball-spin-clockwise-fade-rotating",
  fgsSize: 100,
  fgsColor: "#ffffff",
  fastFadeOut: true
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    importProvidersFrom(
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    ),
  ]
};
