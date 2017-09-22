import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartBasicComponent } from './bar-chart-basic.component';

describe('BarChartBasicComponent', () => {
  let component: BarChartBasicComponent;
  let fixture: ComponentFixture<BarChartBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
