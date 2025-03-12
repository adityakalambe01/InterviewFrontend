import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IInterviewComponent } from './iinterview.component';

describe('IInterviewComponent', () => {
  let component: IInterviewComponent;
  let fixture: ComponentFixture<IInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IInterviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
