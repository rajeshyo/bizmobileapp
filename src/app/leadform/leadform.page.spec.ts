import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadformPage } from './leadform.page';

describe('LeadformPage', () => {
  let component: LeadformPage;
  let fixture: ComponentFixture<LeadformPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadformPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
