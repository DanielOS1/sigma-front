import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcquacultureComponent } from './create-acquaculture.component';

describe('CreateAcquacultureComponent', () => {
  let component: CreateAcquacultureComponent;
  let fixture: ComponentFixture<CreateAcquacultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAcquacultureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAcquacultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
