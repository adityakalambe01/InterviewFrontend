import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IProjectsComponent } from './iprojects.component';

describe('IProjectsComponent', () => {
  let component: IProjectsComponent;
  let fixture: ComponentFixture<IProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
