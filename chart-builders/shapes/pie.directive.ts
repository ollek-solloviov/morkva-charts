import {
  Directive,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import {Location} from '@angular/common';

import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Array from 'd3-array';
import * as d3Select from 'd3-selection';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcPie]'
})
export class PieDirective implements OnInit, OnChanges {

  @Input() data;
  @Input() use_hash_location: boolean;

  @Input() container;
  @Input() margin;
  @Input() g;
  private width;
  private inner_width;
  private height;
  private inner_height;

  private arc;
  private pie;
  private color;
  private radius;
  private pie_shape;

  @Input() doughnut: boolean;

  @Input() color_theme;
  @Input() corner_radius;
  @Input() inner_radius;
  @Input() pad_angle;
  @Input() pie_opacity;

  @Input() use_gradient = true;
  @Input() gradient_theme: any;
  @Input() use_shadow = true;
  @Input() use_animation: boolean;
  @Input() transition: any;

  @Input() pie_fill: boolean;
  @Input() pie_stroke: boolean;
  @Input() pie_stroke_width: number;

  constructor(
    private location: Location
  ) { }

  private getOffset() {
    this.width = this.container.offsetWidth;
    this.inner_width = this.width - this.margin.left - this.margin.right;
    this.height = this.container.offsetHeight;
    this.inner_height = this.height - this.margin.top - this.margin.bottom;
  }

  drawPie() {
    this.g
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    this.radius = Math.min(this.inner_width, this.inner_height) / 2;

    if (this.doughnut === true) {
      this.arc = d3Shape.arc()
        .padRadius(this.radius / 2)
        .cornerRadius(this.corner_radius)
        .outerRadius(this.radius)
        .innerRadius(this.radius / 2 * this.inner_radius);
    } else {
      this.arc = d3Shape.arc()
        .padRadius(this.radius / 2)
        .cornerRadius(this.corner_radius)
        .outerRadius(this.radius)
        .innerRadius(( this.radius * this.pad_angle ) / Math.PI );
    }

    this.color = d3Scale.scaleOrdinal(this.color_theme);

    const grad = d3Scale.scaleOrdinal(d3Array.range(this.gradient_theme.colors.length));

    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.value);

    this.pie
      .padAngle(this.pad_angle);

    this.pie_shape = this.g.datum(this.data).selectAll('path')
      .data(this.pie)
      .enter()
      .append('path')
      .attr('opacity', this.pie_opacity)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    if ( this.use_gradient === true && this.use_hash_location === false ) {
      if ( this.pie_stroke === true) {
        this.pie_shape
          .attr('stroke', (d, i) => 'url(' + this.location.path() + '#linear' + this.gradient_theme.name + '_' + grad(i) + ')')
          .attr('stroke-width', this.pie_stroke_width);
      }
      if ( this.pie_fill === true ) {
        this.pie_shape
          .attr('fill', (d, i) => 'url(' + this.location.path() + '#linear' + this.gradient_theme.name + '_' + grad(i) + ')');
      } else {
        this.pie_shape
          .attr('fill', 'none');
      }
    } else if (this.use_gradient === true && this.use_hash_location === true) {
      if ( this.pie_stroke === true) {
        this.pie_shape
          .attr('stroke', (d, i) => 'url(#linear' + this.gradient_theme.name + '_' + grad(i) + ')')
          .attr('stroke-width', this.pie_stroke_width);
      }
      if ( this.pie_fill === true ) {
        this.pie_shape
          .attr('fill', (d, i) => 'url(#linear' + this.gradient_theme.name + '_' + grad(i) + ')');
      } else {
        this.pie_shape
          .attr('fill', 'none');
      }
    } else {
      if ( this.pie_stroke === true  ) {
        this.pie_shape
          .attr('stroke', (d, i) => this.color(i))
          .attr('stroke-width', this.pie_stroke_width);
      }
      if ( this.pie_fill === true ) {
        this.pie_shape
          .attr('fill', (d, i) => this.color(i));
      } else {
        this.pie_shape
          .attr('fill', 'none');
      }
    }

    if (this.use_shadow === true && this.use_hash_location === false) {
      this.pie_shape
        .attr('filter', 'url(' + this.location.path() + '#shadow)');
    } else if (this.use_shadow === true && this.use_hash_location === true) {
      this.pie_shape
        .attr('filter', 'url(#shadow)');
    }

    if (this.use_animation === true) {
      this.pie_shape
        .transition().duration(2000)
        .attrTween('d', (d) => {
          const i = d3Interpolate.interpolate({startAngle: 0, endAngle: Math.PI / 4}, d);
          return (t) => {
            return this.arc(i(t));
          };
        });
      setTimeout(
        () => {
          this.pie_shape
            .on('mouseover', (d) => {
              d3Select.select(d3Select.event.currentTarget)
                .transition()
                .attr('transform', 'translate(' + this.arc.centroid(d)[0] / 6 + ',' + this.arc.centroid(d)[1] / 6 + ')');
            })
            .on('mouseout', () => {
              d3Select.select(d3Select.event.currentTarget)
                .transition()
                .attr('transform', 'translate(0, 0)');
            });
        }, 2000);
    } else {
      this.pie_shape
        .attr('d', this.arc);
    }
  }

  resizePie() {
    this.getOffset();
    this.g
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    this.radius = Math.min(this.inner_width, this.inner_height) / 2;

    if (this.doughnut === true) {
      this.arc
        .outerRadius(this.radius)
        .innerRadius(this.radius / 2 * this.inner_radius);
    } else {
      this.arc
        .outerRadius(this.radius)
        .innerRadius(( this.radius * this.pad_angle ) / 2);
    }

    this.pie_shape
      .attr('d', this.arc);
  }

  ngOnInit() {
    this.getOffset();
    this.drawPie();
    resEvent(this.container, () => {
      this.resizePie();
    });
  }

  ngOnChanges() {
  }
}
