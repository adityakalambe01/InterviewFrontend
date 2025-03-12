import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewChallengeSubmittedComponent } from './interview-challenge-submitted.component';

describe('InterviewChallengeSubmittedComponent', () => {
  let component: InterviewChallengeSubmittedComponent;
  let fixture: ComponentFixture<InterviewChallengeSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewChallengeSubmittedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewChallengeSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
