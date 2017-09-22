import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as d3Select from 'd3-selection';

@Component({
  selector: 'mc-pie-chart-basic',
  templateUrl: './pie-chart-basic.component.html',
  styleUrls: ['./pie-chart-basic.component.scss']
})
export class PieChartBasicComponent implements OnInit {

  @ViewChild ('container') div_container: ElementRef;
  @ViewChild ('svg') svg_container: ElementRef;

  @Input() use_hash_location = true;
  @Input() data: any;

  @Input() responsive = true;
  @Input() container_height = 100;
  @Input() container_width = 100;
  @Input() margin = { top: 10, right: 5, bottom: 0, left: 5 };
  container;
  svg;
  g;

  type = 'line_chart';

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
  gradient_theme = { name: 'gradient',
    colors: [
      ['#0cebeb', '#29ffc6'],
      ['#ee0979', '#ff6a00'],
      ['#00b09b', '#96c93d']
    ]};

  @Input() doughnut = false;

  @Input() pie_fill = true;
  @Input() pie_stroke = false;
  @Input() pie_stroke_width = 1;
  @Input() pie_opacity = 1;

  @Input() corner_radius = 0;
  @Input() inner_radius = 1;
  @Input() pad_angle = 0;
  @Input() use_gradient = false;
  @Input() use_shadow = false;
  @Input() use_animation = false;
  @Input() transition: any;

  constructor() { }

  drawChartWrapper() {
    this.container = this.div_container.nativeElement;
    this.svg = this.svg_container.nativeElement;

    d3Select.select(this.svg);

    this.g = d3Select.select(this.svg).append('g')
      .attr('class', 'chart_content')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  ngOnInit() {
    this.drawChartWrapper();
  }

}
