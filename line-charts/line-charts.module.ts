import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartBasicComponent } from './line-chart-basic/line-chart-basic.component';
import { ChartBuilderModule } from '../chart-builders/chart-builder.module';

@NgModule({
  imports: [
    CommonModule,
    ChartBuilderModule
  ],
  declarations: [
    LineChartBasicComponent
  ],
  exports: [
    LineChartBasicComponent
  ]
})
export class LineChartsModule { }
