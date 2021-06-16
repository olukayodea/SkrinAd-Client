import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSurveyComponent } from './map-survey.component';

describe('MapSurveyComponent', () => {
  let component: MapSurveyComponent;
  let fixture: ComponentFixture<MapSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
