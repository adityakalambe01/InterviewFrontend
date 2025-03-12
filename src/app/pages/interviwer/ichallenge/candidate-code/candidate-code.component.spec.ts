import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateCodeComponent } from './candidate-code.component';

describe('CandidateCodeComponent', () => {
  let component: CandidateCodeComponent;
  let fixture: ComponentFixture<CandidateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
