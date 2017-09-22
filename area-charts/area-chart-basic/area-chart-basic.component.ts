import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';

@Component({
  selector: 'mc-area-chart-basic',
  templateUrl: './area-chart-basic.component.html',
  styleUrls: ['./area-chart-basic.component.scss']
})
export class AreaChartBasicComponent implements OnInit {

  @ViewChild ('container') div_container: ElementRef;
  @ViewChild ('svg') svg_container: ElementRef;

  @Input() data: any;

  @Input() use_hash_location = true;
  @Input() responsive = true;
  @Input() container_height = 100;
  @Input() container_width = 100;
  @Input() margin = { top: 50, right: 50, bottom: 50, left: 50 };
  container;
  svg;
  g;

  type = 'area';

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
  @Input() show_y_axis = true;
  @Input() enable_negative_values = true;
  @Input() nice_y_scale = false;
  @Input() nice_step: number;
  @Input() y_axis_params =  {
    dasharray: '1, 0',
    line_width: 1,
    line_opacity: 1,
    line_color: 'black',
    text_opacity: 1,
    text_color: 'black'
  };
  @Input() y_tick_size: string;

  @Input() area_type = 'linear';
  @Input() area_opacity = 1;
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
  @Input() gradient_theme = { name: 'gradient1',
    colors: [
      ['#F44336', '#E91E63'],
      ['#673AB7', '#9C27B0']
    ]};

  @Input() use_shadow = false;
  @Input() use_animation = false;
  @Input() transition = {
    appear: 500,
    update: 500
  };

  @Input() use_tooltip = false;
  @Input() use_legend = false;

  constructor() { }

  drawChartWrapper() {
    this.container = this.div_container.nativeElement;
    this.svg = this.svg_container.nativeElement;

    this.g = d3Select.select(this.svg)
      .append('g')
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
