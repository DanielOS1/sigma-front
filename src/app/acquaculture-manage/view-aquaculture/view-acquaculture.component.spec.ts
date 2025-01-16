import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcquacultureComponent } from './view-aquaculture.component';

describe('ViewAcquacultureComponent', () => {
  let component: ViewAcquacultureComponent;
  let fixture: ComponentFixture<ViewAcquacultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAcquacultureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAcquacultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
