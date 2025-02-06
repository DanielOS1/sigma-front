import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSensorModalComponent } from './create-sensor-modal.component';

describe('CreateSensorModalComponent', () => {
  let component: CreateSensorModalComponent;
  let fixture: ComponentFixture<CreateSensorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSensorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSensorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
