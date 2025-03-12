import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewModalComponent } from './interview-modal.component';

describe('InterviewModalComponent', () => {
  let component: InterviewModalComponent;
  let fixture: ComponentFixture<InterviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
