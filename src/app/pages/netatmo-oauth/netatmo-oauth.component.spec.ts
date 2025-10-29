import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetatmoOauthComponent } from './netatmo-oauth.component';

describe('NetatmoOauthComponent', () => {
  let component: NetatmoOauthComponent;
  let fixture: ComponentFixture<NetatmoOauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetatmoOauthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetatmoOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
