import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScientistDashboardComponent } from './scientist-dashboard.component';

describe('ScientistDashboardComponent', () => {
  let component: ScientistDashboardComponent;
  let fixture: ComponentFixture<ScientistDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScientistDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScientistDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
