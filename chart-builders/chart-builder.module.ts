import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerDirective } from './container/container.directive';
import { AreaDirective } from './shapes/area.directive';
import { LineDirective } from './shapes/line.directive';
import { BarDirective } from './shapes/bar.directive';
import { XAxisBasicDirective } from './axis/x-axis-basic.directive';
import { YAxisBasicDirective } from './axis/y-axis-basic.directive';
import { SvgDirective } from './container/svg.directive';
import { ShadowDirective } from './graphics/shadow.directive';
import { GradientDirective } from './graphics/gradient.directive';

import 'd3-transition';

import { TooltipDirective } from './tools/tooltip.directive';
import { LegendDirective } from './tools/legend.directive';
import { PieDirective } from './shapes/pie.directive';
import { LinearGradientDirective } from './graphics/linear-gradient.directive';
import { RadialGradientDirective } from './graphics/radial-gradient.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ContainerDirective,
    AreaDirective,
    LineDirective,
    BarDirective,
    XAxisBasicDirective,
    YAxisBasicDirective,
    SvgDirective,
    ShadowDirective,
    GradientDirective,
    TooltipDirective,
    LegendDirective,
    PieDirective,
    LinearGradientDirective,
    RadialGradientDirective,
  ],
  exports: [
    ContainerDirective,
    AreaDirective,
    LineDirective,
    BarDirective,
    XAxisBasicDirective,
    YAxisBasicDirective,
    SvgDirective,
    ShadowDirective,
    GradientDirective,
    TooltipDirective,
    LegendDirective,
    PieDirective,
    LinearGradientDirective,
    RadialGradientDirective,
  ]
})
export class ChartBuilderModule { }
