import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaChartBasicComponent } from './area-chart-basic.component';

describe('AreaChartBasicComponent', () => {
  let component: AreaChartBasicComponent;
  let fixture: ComponentFixture<AreaChartBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaChartBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaChartBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
