import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeInstructionsComponent } from './challenge-instructions.component';

describe('ChallengeInstructionsComponent', () => {
  let component: ChallengeInstructionsComponent;
  let fixture: ComponentFixture<ChallengeInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeInstructionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
