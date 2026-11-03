import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrownWorkshopComponent } from './crown-workshop.component';

describe('CrownWorkshopComponent', () => {
  let component: CrownWorkshopComponent;
  let fixture: ComponentFixture<CrownWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrownWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrownWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
