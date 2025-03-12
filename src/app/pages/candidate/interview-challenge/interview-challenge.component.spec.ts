import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewChallengeComponent } from './interview-challenge.component';

describe('InterviewChallengeComponent', () => {
  let component: InterviewChallengeComponent;
  let fixture: ComponentFixture<InterviewChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewChallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
