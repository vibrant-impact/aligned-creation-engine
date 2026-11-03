import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SacralWorkshopComponent } from './sacral-workshop.component';

describe('SacralWorkshopComponent', () => {
  let component: SacralWorkshopComponent;
  let fixture: ComponentFixture<SacralWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SacralWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SacralWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
