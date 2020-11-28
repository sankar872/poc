import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardAllocationComponent } from './onboard-allocation.component';

describe('OnboardAllocationComponent', () => {
  let component: OnboardAllocationComponent;
  let fixture: ComponentFixture<OnboardAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
