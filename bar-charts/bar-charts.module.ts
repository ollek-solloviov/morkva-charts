import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartBasicComponent } from './bar-chart-basic/bar-chart-basic.component';
import { ChartBuilderModule } from '../chart-builders/chart-builder.module';

@NgModule({
  imports: [
    CommonModule,
    ChartBuilderModule
  ],
  declarations: [
    BarChartBasicComponent
  ],
  exports: [
    BarChartBasicComponent
  ]
})
export class BarChartsModule { }
