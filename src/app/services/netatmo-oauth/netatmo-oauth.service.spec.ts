import { TestBed } from '@angular/core/testing';

import { NetatmoOAuthService } from './netatmo-oauth.service';

describe('NetatmoOauthService', () => {
  let service: NetatmoOAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetatmoOAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
