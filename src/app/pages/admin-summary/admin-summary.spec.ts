import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSummary } from './admin-summary';

describe('AdminSummary', () => {
  let component: AdminSummary;
  let fixture: ComponentFixture<AdminSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
