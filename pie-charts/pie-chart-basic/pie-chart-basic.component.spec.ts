import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartBasicComponent } from './pie-chart-basic.component';

describe('PieChartBasicComponent', () => {
  let component: PieChartBasicComponent;
  let fixture: ComponentFixture<PieChartBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
