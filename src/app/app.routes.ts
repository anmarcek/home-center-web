import { Routes } from '@angular/router';
import {WeatherComponent} from "./pages/weather/weather.component";
import {NetatmoOauthComponent} from "./pages/netatmo-oauth/netatmo-oauth.component";

export const routes: Routes = [
  {
    path: '',
    component: WeatherComponent,
  },
  {
    path: 'netatmo-oauth-callback',
    component: NetatmoOauthComponent
  }
];
