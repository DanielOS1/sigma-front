import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolManageComponent } from './pool-manage.component';

describe('PoolManageComponent', () => {
  let component: PoolManageComponent;
  let fixture: ComponentFixture<PoolManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
