import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardAnalyticsComponent } from './onboard-analytics.component';

describe('OnboardAnalyticsComponent', () => {
  let component: OnboardAnalyticsComponent;
  let fixture: ComponentFixture<OnboardAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
