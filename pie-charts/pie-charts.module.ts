import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartBasicComponent } from './pie-chart-basic/pie-chart-basic.component';
import { ChartBuilderModule } from '../chart-builders/chart-builder.module';

@NgModule({
  imports: [
    CommonModule,
    ChartBuilderModule
  ],
  declarations: [
    PieChartBasicComponent
  ],
  exports: [
    PieChartBasicComponent
  ]
})
export class PieChartsModule { }
