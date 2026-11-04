import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChakraMeditationTimerComponent } from './chakra-meditation-timer.component';

describe('ChakraMeditationTimerComponent', () => {
  let component: ChakraMeditationTimerComponent;
  let fixture: ComponentFixture<ChakraMeditationTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChakraMeditationTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChakraMeditationTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
