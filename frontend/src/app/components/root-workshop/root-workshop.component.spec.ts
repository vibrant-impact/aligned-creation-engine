import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootWorkshopComponent } from './root-workshop.component';

describe('RootWorkshopComponent', () => {
  let component: RootWorkshopComponent;
  let fixture: ComponentFixture<RootWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RootWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
