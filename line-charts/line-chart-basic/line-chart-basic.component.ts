import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';

@Component({
  selector: 'mc-line-chart-basic',
  templateUrl: './line-chart-basic.component.html',
  styleUrls: ['./line-chart-basic.component.scss'],
})
export class LineChartBasicComponent implements OnInit {

  @ViewChild ('container') div_container: ElementRef;
  @ViewChild ('svg') svg_container: ElementRef;

  @Input() use_hash_location = true;
  @Input() data: any;

  @Input() responsive = true;
  @Input() container_height = 100;
  @Input() container_width = 100;
  @Input() margin = { top: 50, right: 50, bottom: 50, left: 50 };
  container;
  svg;
  g;

  type = 'line_chart';

  x_scale;
  @Input() data_type = 'time';
  @Input() time_type = 'weak';
  @Input() show_x_axis: boolean;
  @Input() remove_domain = true;
  @Input() x_axis_params =  {
    dasharray: '1, 0',
    line_width: 1,
    line_opacity: 1,
    line_color: 'black',
    text_opacity: 1,
    text_color: 'black'
  };
  @Input() x_tick_size: string;

  y_scale;
  @Input() show_y_axis: boolean;
  @Input() enable_negative_values: boolean;
  @Input() nice_y_scale: boolean;
  @Input() nice_step: boolean;
  @Input() y_axis_params =  {
    dasharray: '1, 0',
    line_width: 1,
    line_opacity: 1,
    line_color: 'black',
    text_opacity: 1,
    text_color: 'black'
  };
  @Input() y_tick_size: string;

  @Input() line_type: string;
  @Input() line_width = 2;
  @Input() line_opacity: number;
  @Input() color_theme = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50'
  ];
  @Input() use_gradient = false;
  @Input() gradient_theme;
  @Input() use_shadow = false;
  @Input() use_animation = false;
  @Input() transition = {
    appear: 500,
    update: 100
  };

  constructor() { }

  drawChartWrapper() {
    this.container = this.div_container.nativeElement;
    this.svg = this.svg_container.nativeElement;

    d3Select.select(this.svg)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    this.g = d3Select.select(this.svg).append('g')
      .attr('class', 'chart_content')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  genScales() {
    this.x_scale = d3Scale.scaleTime();
    this.y_scale = d3Scale.scaleLinear();
  }

  ngOnInit() {
    this.drawChartWrapper();
    this.genScales();
  }

}
