import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolDetailsModalComponent } from './pool-details-modal.component';

describe('PoolDetailsModalComponent', () => {
  let component: PoolDetailsModalComponent;
  let fixture: ComponentFixture<PoolDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
