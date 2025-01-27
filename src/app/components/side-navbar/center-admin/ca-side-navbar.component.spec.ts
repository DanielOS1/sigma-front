import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSideNavbarComponent } from './ca-side-navbar.component';

describe('CaSideNavbarComponent', () => {
  let component: CaSideNavbarComponent;
  let fixture: ComponentFixture<CaSideNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaSideNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaSideNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
