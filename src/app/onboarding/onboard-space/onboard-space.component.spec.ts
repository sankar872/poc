import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardSpaceComponent } from './onboard-space.component';

describe('OnboardSpaceComponent', () => {
  let component: OnboardSpaceComponent;
  let fixture: ComponentFixture<OnboardSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
