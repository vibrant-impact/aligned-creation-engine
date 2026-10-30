import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlignmentSpineComponent } from './alignment-spine.component';

describe('AlignmentSpineComponent', () => {
  let component: AlignmentSpineComponent;
  let fixture: ComponentFixture<AlignmentSpineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlignmentSpineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlignmentSpineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
