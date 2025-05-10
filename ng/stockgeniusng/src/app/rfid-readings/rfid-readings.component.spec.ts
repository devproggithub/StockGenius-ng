import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidReadingsComponent } from './rfid-readings.component';

describe('RfidReadingsComponent', () => {
  let component: RfidReadingsComponent;
  let fixture: ComponentFixture<RfidReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfidReadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RfidReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
