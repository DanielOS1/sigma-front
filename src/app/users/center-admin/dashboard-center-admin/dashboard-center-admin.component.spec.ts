import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCenterAdminComponent } from './dashboard-center-admin.component';

describe('DashboardCenterAdminComponent', () => {
  let component: DashboardCenterAdminComponent;
  let fixture: ComponentFixture<DashboardCenterAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCenterAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCenterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
