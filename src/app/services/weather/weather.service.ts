import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OAuthTokens } from '../../interfaces/oauth-tokens';
import { BehaviorSubject, iif, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Weather } from '../../interfaces/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http = inject(HttpClient);

  private readonly tokensLocalStorageKey = 'WeatherServiceTokens';

  private readonly tokensSubject;
  private readonly weatherSubject = new BehaviorSubject<Weather | undefined>(undefined);

  public weather$ = this.weatherSubject.asObservable();

  constructor() {
    const tokens = this.getTokensFromLocalStorage();
    this.tokensSubject = new BehaviorSubject<OAuthTokens | undefined>(tokens);
  }

  authorize() {
    window.location.href = `${environment.netatmo.authorizeUrl}?client_id=${environment.netatmo.clientId}&redirect_uri=${environment.netatmo.redirectUri}&scope=read_station&response_type=code`;
  }

  finishAuthorization(authorizationCode: string): Observable<undefined> {
    const params = new HttpParams()
      .set("authorizationCode", authorizationCode)
      .set("redirectUri", environment.netatmo.redirectUri);

    return this.http
      .get<OAuthTokens>(`${environment.apiUrl}/netatmo-oauth/get-oauth-tokens`, { params: params })
      .pipe(
        tap(tokens => {
          this.tokensSubject.next(tokens);
          this.setTokensToLocalStorage(tokens);
        }),
        map(() => undefined)
      );
  }

  refreshWeather() {
    return this.getWeather().pipe(
      tap((weather) => {
        this.weatherSubject.next(weather);
      })
    );
  }

  private getWeather(): Observable<Weather> {
    return this
      .getAccessToken()
      .pipe(switchMap(accessToken => {
        const params = new HttpParams().set("accessToken", accessToken);
        return this.http.get<Weather>(`${environment.apiUrl}/weather/weather`, { params: params });
      }));
  }

  private getAccessToken(): Observable<string> {
    return this.tokensSubject.pipe(
      take(1),
      switchMap(tokens => {
        if (!tokens) {
          return throwError(() => new Error('NotAuthorized'));
        }

        if (this.isAccessTokenExpired(tokens)) {
          return this.refreshOAuthTokens(tokens).pipe(
            map((newTokens) => newTokens.accessToken)
          );
        }

        return of(tokens.accessToken);
      })
    );
  }

  private isAccessTokenExpired(tokens: OAuthTokens): boolean {
    const expiresAt = new Date(tokens.expiresAt).getTime();
    return expiresAt < (new Date().getTime()) + 60 * 1000;
  }

  private refreshOAuthTokens(tokens: OAuthTokens): Observable<OAuthTokens> {
    const params = new HttpParams()
      .set("refreshToken", tokens.refreshToken);

    return this.http
      .get<OAuthTokens>(`${environment.apiUrl}/netatmo-oauth/refresh-oauth-tokens`, { params: params })
      .pipe(
        tap(tokens => {
          this.tokensSubject.next(tokens);
          this.setTokensToLocalStorage(tokens);
        }),
      );
  }

  private setTokensToLocalStorage(tokens: OAuthTokens): void {
    const tokensAsJson = JSON.stringify(tokens);
    localStorage.setItem(this.tokensLocalStorageKey, tokensAsJson);
  }

  private getTokensFromLocalStorage() {
    const tokensAsJson = localStorage.getItem(this.tokensLocalStorageKey);
    if (tokensAsJson !== null) {
      return JSON.parse(tokensAsJson) as OAuthTokens;
    } else {
      return undefined;
    }
  }
}
