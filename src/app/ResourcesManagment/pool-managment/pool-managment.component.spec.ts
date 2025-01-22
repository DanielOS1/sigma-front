import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolManagmentComponent } from './pool-managment.component';

describe('PoolManagmentComponent', () => {
  let component: PoolManagmentComponent;
  let fixture: ComponentFixture<PoolManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
