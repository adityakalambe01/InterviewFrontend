import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IChallengeComponent } from './ichallenge.component';

describe('IChallengeComponent', () => {
  let component: IChallengeComponent;
  let fixture: ComponentFixture<IChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IChallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
