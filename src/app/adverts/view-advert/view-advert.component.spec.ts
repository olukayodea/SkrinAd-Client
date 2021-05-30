import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdvertComponent } from './view-advert.component';

describe('ViewAdvertComponent', () => {
  let component: ViewAdvertComponent;
  let fixture: ComponentFixture<ViewAdvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAdvertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAdvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
