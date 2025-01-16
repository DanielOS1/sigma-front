import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquacultureManageComponent } from './acquaculture-manage.component';

describe('AcquacultureManageComponent', () => {
  let component: AcquacultureManageComponent;
  let fixture: ComponentFixture<AcquacultureManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquacultureManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquacultureManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
