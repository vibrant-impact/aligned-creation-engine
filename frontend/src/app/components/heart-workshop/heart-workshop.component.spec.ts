import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeartWorkshopComponent } from './heart-workshop.component';

describe('HeartWorkshopComponent', () => {
  let component: HeartWorkshopComponent;
  let fixture: ComponentFixture<HeartWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeartWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeartWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
