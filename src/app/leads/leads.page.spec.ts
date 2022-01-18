import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsPage } from './leads.page';

describe('LeadsPage', () => {
  let component: LeadsPage;
  let fixture: ComponentFixture<LeadsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
