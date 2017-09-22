import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaChartBasicComponent } from './area-chart-basic/area-chart-basic.component';
import { ChartBuilderModule } from '../chart-builders/chart-builder.module';

@NgModule({
  imports: [
    CommonModule,
    ChartBuilderModule
  ],
  declarations: [
    AreaChartBasicComponent
  ],
  exports: [
    AreaChartBasicComponent
  ]
})
export class AreaChartsModule { }
