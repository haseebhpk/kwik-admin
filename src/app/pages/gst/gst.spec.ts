import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gst } from './gst';

describe('Gst', () => {
  let component: Gst;
  let fixture: ComponentFixture<Gst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gst]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
