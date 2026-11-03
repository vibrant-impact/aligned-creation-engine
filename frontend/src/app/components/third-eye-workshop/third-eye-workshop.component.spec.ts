import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdEyeWorkshopComponent } from './third-eye-workshop.component';

describe('ThirdEyeWorkshopComponent', () => {
  let component: ThirdEyeWorkshopComponent;
  let fixture: ComponentFixture<ThirdEyeWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdEyeWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdEyeWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
