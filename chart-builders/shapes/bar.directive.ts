import {
  Directive,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import { Location } from '@angular/common';

import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcBar]'
})
export class BarDirective implements OnInit, OnChanges {

  // Data
  @Input() data: any;

  // Offset properties
  @Input() container: any;
  @Input() margin: any;
  @Input() g: any;
  @Input() use_hash_location: boolean;

  // Area draw properties;
  @Input() x_scale: any;
  @Input() y_scale: any;
  private inner_x_scale;
  private legend_values;
  private bar;
  private bar_shape;

  // Bar styles
  @Input() bar_padding: any;
  @Input() bar_opacity: number;
  @Input() bar_border_radius: number;
  @Input() color_theme: string;

  @Input() use_gradient: boolean;
  @Input() gradient_theme: any;
  @Input() use_shadow: boolean;
  @Input() use_animation: boolean;
  @Input() transition: any;

  constructor(
    private location: Location
  ) { }

  getData() {
    this.legend_values = [];
    for ( const value of this.data ) {
      this.legend_values.push(value.label);
    }
  }

  drawBar() {
    this.inner_x_scale = d3Scale.scaleBand();
    this.inner_x_scale.domain(this.legend_values)
      .rangeRound([0, this.x_scale.bandwidth()])
      .paddingInner(this.bar_padding.inner)
      .paddingOuter(this.bar_padding.outer);

    let index = 0;
    let bar_index = 1;
    for ( const value of this.data ) {
      this.bar_shape = this.g.append('g')
        .attr('class', 'bars' + bar_index).selectAll('bar')
        .data(value.data).enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('id', 'bar' + bar_index)
        .attr('rx', this.bar_border_radius)
        .attr('ry', this.bar_border_radius)
        .attr('opacity', this.bar_opacity)
        .attr('x', (d) => this.x_scale(d.date))
        .attr('y', this.y_scale(0))
        .attr('width', this.inner_x_scale.bandwidth());

      if ( this.use_gradient === true && this.use_hash_location === false ) {
        this.bar_shape
          .attr('fill', 'url(' + this.location.path() + '#linear' + this.gradient_theme.name  + '_' + index + ')');
      } else if ( this.use_gradient === true && this.use_hash_location === true ) {
        this.bar_shape
          .attr('fill', 'url(#linear' + this.gradient_theme.name  + '_' + index + ')');
      } else {
        this.bar_shape
          .attr('fill', this.color_theme[index]);
      }

      if ( this.use_shadow === true && this.use_hash_location === false ) {
        this.bar_shape
          .attr('filter', 'url(' + this.location.path() + '#shadow)');
      } else if ( this.use_shadow === true && this.use_hash_location === true ) {
        this.bar_shape
          .attr('filter', 'url(#shadow)');
      }

      if ( this.use_animation === true ) {
        this.bar_shape
          .transition()
          .attr('y',
            (d) => {
              if (d.value > 0) {
                return this.y_scale(d.value);
              } else {
                return this.y_scale(0);
              }
            })
          .attr('height', (d) => Math.abs(this.y_scale(d.value) - this.y_scale(0)));
      } else {
        this.bar_shape
          .attr('y',
            (d) => {
              if (d.value > 0) {
                return this.y_scale(d.value);
              } else {
                return this.y_scale(0);
              }
            })
          .attr('height', (d) => Math.abs(this.y_scale(d.value) - this.y_scale(0)));
      }

      d3Select.select(this.container).selectAll('.bars' + bar_index )
        .attr('transform', 'translate(' + this.inner_x_scale(value.label) + ', 0)');

      bar_index++;

      if (index < (this.color_theme.length - 1)) {
        index++;
      } else {
        index = 0;
      }
    }
  }

  resizeBar() {
    let bar_index = 1;
    this.inner_x_scale.rangeRound([0, this.x_scale.bandwidth()]).padding(0.1).paddingOuter(0.2);

    for ( const value of this.data ) {
      this.bar_shape = d3Select.select(this.container).selectAll('#bar' + bar_index)
        .data(value.data);
      this.bar_shape
        .attr('x', (d: any) => this.x_scale(d.date))
        .attr('width', this.inner_x_scale.bandwidth());
      //
      d3Select.select(this.container).selectAll('.bars' + bar_index )
        .attr('transform', 'translate(' + this.inner_x_scale(value.label) + ', 0)');

      bar_index++;
    }
  }

  updateBar() {
    this.getData();
    this.inner_x_scale = d3Scale.scaleBand();
    this.inner_x_scale.domain(this.legend_values)
      .rangeRound([0, this.x_scale.bandwidth()])
      .paddingInner(this.bar_padding.inner)
      .paddingOuter(this.bar_padding.outer);


    let bar_index = 1;
    for ( const value of this.data ) {
      this.bar_shape = d3Select.select(this.container).selectAll('#bar' + bar_index)
        .data(value.data);
      this.bar_shape
        .attr('x', (d: any) => this.x_scale(d.date))
        .attr('width', this.inner_x_scale.bandwidth());
      //
      d3Select.select(this.container).selectAll('.bars' + bar_index )
        .attr('transform', 'translate(' + this.inner_x_scale(value.label) + ', 0)');

      if ( this.use_animation === true ) {
        this.bar_shape
          .transition()
          .attr('y',
            (d: any) => {
              if (d.value > 0) {
                return this.y_scale(d.value);
              } else {
                return this.y_scale(0);
              }
            })
          .attr('height', (d: any) => Math.abs(this.y_scale(d.value) - this.y_scale(0)));
      } else {
        this.bar_shape
          .attr('y',
            (d: any) => {
              if (d.value > 0) {
                return this.y_scale(d.value);
              } else {
                return this.y_scale(0);
              }
            })
          .attr('height', (d: any) => Math.abs(this.y_scale(d.value) - this.y_scale(0)));
      }

      bar_index++;
    }
  }

  ngOnInit() {
    this.getData();
    if ( this.use_animation === true ) {
      setTimeout(
        () => {
          this.drawBar();
        }, 500
      );
    } else {
      this.drawBar();
    }
    resEvent(this.container, () => {
      this.resizeBar();
    });
  }

  ngOnChanges() {
    this.updateBar();
  }


}
