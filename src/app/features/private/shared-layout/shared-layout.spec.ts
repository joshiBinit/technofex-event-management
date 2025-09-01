import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLayout } from './shared-layout';

describe('SharedLayout', () => {
  let component: SharedLayout;
  let fixture: ComponentFixture<SharedLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
