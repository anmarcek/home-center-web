import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NetatmoOAuthService} from "../../services/netatmo-oauth/netatmo-oauth.service";
import {NgxUiLoaderModule, NgxUiLoaderService} from "ngx-ui-loader";
import {finalize} from "rxjs";

@Component({
  selector: 'app-netatmo-oauth',
  standalone: true,
  imports: [
    NgxUiLoaderModule
  ],
  templateUrl: './netatmo-oauth.component.html',
  styleUrl: './netatmo-oauth.component.scss'
})
export class NetatmoOauthComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly netatmoOAuthService = inject(NetatmoOAuthService);
  private readonly ngxUiLoaderService = inject(NgxUiLoaderService);

  authorizationCodeIsMissing = false;
  authorizationFailed = false;

  ngOnInit() {
    const authorizationCode = this.route.snapshot.queryParamMap.get('code');

    if(authorizationCode) {
      this.ngxUiLoaderService.start();

      this.netatmoOAuthService.finishAuthorization(authorizationCode)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.ngxUiLoaderService.stop();
          })
        )
        .subscribe({
          next:  () => {
            this.router.navigate(['/']);
          },
          error: err => {
            this.authorizationFailed = true;
          }
        });
    } else {
      this.authorizationCodeIsMissing = true;
    }
  }

  retryAuthorization() {
    this.netatmoOAuthService.authorize();
  }
}
