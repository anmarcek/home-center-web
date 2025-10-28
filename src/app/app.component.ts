import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather/weather.service';
import {iif, interval, map, of, startWith, switchMap} from 'rxjs';
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgIf, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'home-center-web';

  private readonly destroyRef = inject(DestroyRef);
  private readonly weatherService = inject(WeatherService);

  readonly weather$ = this.weatherService.weather$;
  readonly clock$ = interval(1000).pipe(map(() => new Date()));

  ngOnInit() {
    const authorizationCode = new URLSearchParams(window.location.search).get('code');

    iif(
      () => authorizationCode !== null,
      this.weatherService.finishAuthorization(authorizationCode as string),
      of(undefined)
    )
      .pipe(
        switchMap(() => interval(1000 * 45)),
        startWith(undefined),
        switchMap(() => this.weatherService.refreshWeather()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (weather) => {
          console.log(weather);
        },
        error: (error: Error) => {
          if (error.message === 'NotAuthorized') {
            this.weatherService.authorize();
          } else {
            console.error('Error while fetching weather data:', error);
          }
        }
      });
  }
}
