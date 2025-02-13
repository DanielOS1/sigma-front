import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AquacultureManageComponent } from './aquaculture-manage.component';

describe('AcquacultureManageComponent', () => {
  let component: AquacultureManageComponent;
  let fixture: ComponentFixture<AquacultureManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AquacultureManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AquacultureManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
