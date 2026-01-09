import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStation } from './add-station';

describe('AddStation', () => {
  let component: AddStation;
  let fixture: ComponentFixture<AddStation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
