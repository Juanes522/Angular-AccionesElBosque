import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponentComponent } from './user-profile-component.component';

describe('UserProfileComponentComponent', () => {
  let component: UserProfileComponentComponent;
  let fixture: ComponentFixture<UserProfileComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileComponentComponent]
    });
    fixture = TestBed.createComponent(UserProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
