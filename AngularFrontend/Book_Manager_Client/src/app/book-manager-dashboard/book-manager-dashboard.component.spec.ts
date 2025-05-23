import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookManagerDashboardComponent } from './book-manager-dashboard.component';

describe('BookManagerDashboardComponent', () => {
  let component: BookManagerDashboardComponent;
  let fixture: ComponentFixture<BookManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
