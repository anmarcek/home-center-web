import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {interval, map, startWith, switchMap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {WeatherService} from "../../services/weather/weather.service";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {NetatmoOAuthService} from "../../services/netatmo-oauth/netatmo-oauth.service";

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgIf
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly netatmoOAuthService = inject(NetatmoOAuthService);
  private readonly weatherService = inject(WeatherService);

  readonly weather$ = this.weatherService.weather$;
  readonly clock$ = interval(1000).pipe(map(() => new Date()));

  ngOnInit() {
    interval(1000 * 45)
      .pipe(
        startWith(undefined),
        switchMap(() => this.weatherService.refreshWeather()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: (error: any) => {
          if (this.netatmoOAuthService.isUnauthorizedError(error)) {
            this.netatmoOAuthService.authorize();
          } else {
            console.error('Error while fetching weather data:', error);
          }
        }
      });
  }
}
