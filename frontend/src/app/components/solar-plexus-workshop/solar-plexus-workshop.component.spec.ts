import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPlexusWorkshopComponent } from './solar-plexus-workshop.component';

describe('SolarPlexusWorkshopComponent', () => {
  let component: SolarPlexusWorkshopComponent;
  let fixture: ComponentFixture<SolarPlexusWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarPlexusWorkshopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPlexusWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
