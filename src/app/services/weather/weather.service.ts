import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OAuthTokens } from '../../interfaces/oauth-tokens';
import { BehaviorSubject, iif, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Weather } from '../../interfaces/weather';
import {NetatmoOAuthService} from "../netatmo-oauth/netatmo-oauth.service";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly netatmoOAuthService = inject(NetatmoOAuthService);

  private readonly weatherSubject = new BehaviorSubject<Weather | undefined>(undefined);

  public weather$ = this.weatherSubject.asObservable();

  refreshWeather() {
    return this.getWeather().pipe(
      tap((weather) => {
        this.weatherSubject.next(weather);
      })
    );
  }

  private getWeather(): Observable<Weather> {
    return this.netatmoOAuthService
      .getAccessToken()
      .pipe(switchMap(accessToken => {
        const params = new HttpParams().set("accessToken", accessToken);
        return this.http.get<Weather>(`${environment.apiUrl}/weather/weather`, { params: params });
      }));
  }
}
