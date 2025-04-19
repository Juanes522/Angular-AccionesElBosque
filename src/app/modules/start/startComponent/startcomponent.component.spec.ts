import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartcomponentComponent } from './startcomponent.component';

describe('StartcomponentComponent', () => {
  let component: StartcomponentComponent;
  let fixture: ComponentFixture<StartcomponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartcomponentComponent]
    });
    fixture = TestBed.createComponent(StartcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
