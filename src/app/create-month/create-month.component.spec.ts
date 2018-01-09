import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMonthComponent } from './create-month.component';

describe('CreateMonthComponent', () => {
  let component: CreateMonthComponent;
  let fixture: ComponentFixture<CreateMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
