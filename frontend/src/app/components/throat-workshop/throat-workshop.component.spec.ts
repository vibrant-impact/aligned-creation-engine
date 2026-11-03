import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThroatWorkshopComponent } from './throat-workshop.component';

describe('ThroatWorkshopComponent', () => {
  let component: ThroatWorkshopComponent;
  let fixture: ComponentFixture<ThroatWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThroatWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThroatWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
