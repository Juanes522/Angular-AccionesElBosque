import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartComponentComponent } from './start-component.component';

describe('StartComponentComponent', () => {
  let component: StartComponentComponent;
  let fixture: ComponentFixture<StartComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartComponentComponent]
    });
    fixture = TestBed.createComponent(StartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
