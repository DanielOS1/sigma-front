import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorAdministrationComponent } from './sensor-administration.component';

describe('SensorAdministrationComponent', () => {
  let component: SensorAdministrationComponent;
  let fixture: ComponentFixture<SensorAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
