import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStation } from './charging-station';

describe('ChargingStation', () => {
  let component: ChargingStation;
  let fixture: ComponentFixture<ChargingStation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargingStation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargingStation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
