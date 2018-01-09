import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthFormComponent } from './month-form.component';

describe('MonthFormComponent', () => {
  let component: MonthFormComponent;
  let fixture: ComponentFixture<MonthFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
