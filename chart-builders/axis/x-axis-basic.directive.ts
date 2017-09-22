import {
  Directive,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';

import * as d3Select from 'd3-selection';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Time from 'd3-time';
import * as d3TimeFormat from 'd3-time-format';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcXAxisBasic]'
})
export class XAxisBasicDirective implements OnInit, OnChanges {

  // Offset properties
  @Input() container;
  @Input() margin;
  @Input() g;
  private width;
  private inner_width;
  private height;
  private inner_height;

  // Data parsing;
  @Input() data;
  @Input() data_type;
  private x_axis_values;

  // Axis draw properties;
  @Input() time_type;
  @Input() x_scale;
  @Input() x_tick_size;
  private axis;
  private x_axis;

  // Axis style
  @Input() remove_domain;
  @Input() x_axis_params;
  @Input() show_x_axis;
  @Input() use_animation;
  @Input() transition;


  constructor() { }

  private getOffset() {
    this.width = this.container.offsetWidth;
    this.inner_width = this.width - this.margin.left - this.margin.right;
    this.height = this.container.offsetHeight;
    this.inner_height = this.height - this.margin.top - this.margin.bottom;
  }

  private getData() {
    this.x_axis_values = [];
    for ( const value of this.data ) {
      value.data.map((d) => {
        if ( this.data_type === 'time' || this.data_type === 'time_band') {
          this.x_axis_values.push(d.date);
        } else if ( this.data_type === 'number') {
          this.x_axis_values.push(d.value);
        } else {
          this.x_axis_values.push(d.name);
        }
      });
    }
  }

  private timeFunction() {
    if ( this.time_type === 'day' ) {
      return d3Time.timeDay;
    } else if ( this.time_type === 'weak') {
      return d3Time.timeWeek;
    } else if ( this.time_type === 'month') {
      return d3Time.timeMonth;
    }
  }

  private applyStyles() {
    this.x_axis = d3Select.select(this.container).select('#x_axis');

    this.x_axis.selectAll('line')
      .attr('stroke-dasharray', this.x_axis_params.dasharray)
      .style('opacity', this.x_axis_params.line_opacity)
      .attr('stroke-width', this.x_axis_params.line_width)
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke', this.x_axis_params.line_color);

    if ( this.data_type === 'time_band') {
      this.x_axis.selectAll('line')
        .attr('transform', 'translate(' + this.x_scale.bandwidth() / 2 + ', 0)');
    }


    this.x_axis.selectAll('.domain')
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke-linecap', 'square')
      .attr('stroke',  this.x_axis_params.line_color);

    this.x_axis.selectAll('text')
      .attr('opacity', this.x_axis_params.text_opacity)
      .attr('fill',  this.x_axis_params.text_color );

    if ( this.show_x_axis === false ) {
      this.x_axis.selectAll('line').remove();
      this.x_axis.selectAll('.domain').remove();
      this.x_axis.selectAll('text').remove();
    }

    if ( this.remove_domain === true ) {
      this.x_axis.selectAll('.domain').remove();
    }
  }

  private drawXAxis() {
    if ( this.data_type === 'time') {
      this.x_scale.domain(d3Array.extent(this.x_axis_values))
        .range([0, this.inner_width]);
    } else if ( this.data_type === 'time_band' ) {
      this.x_scale.domain(this.x_axis_values)
        .range([0, this.inner_width]);
    }

    this.axis = d3Axis.axisBottom(this.x_scale)
      .tickPadding( this.margin.bottom / 2 );

    if ( this.x_tick_size ) {
      this.axis.tickSizeInner(this.x_tick_size.inner)
        .tickSizeOuter(this.x_tick_size.outer);
    } else {
      this.axis.tickSizeInner(-this.inner_height);
      this.axis.tickSizeOuter(0);
    }

    if ( this.data_type === 'time' ) {
      this.axis.ticks(this.timeFunction());
    } else if ( this.data_type === 'time_band' ) {
      this.axis.tickFormat(d3TimeFormat.timeFormat('%m/%d'));
    } else if ( this.data_type === 'numeric' ) {
      this.axis.ticks(Math.max(this.inner_width / 50, 2));
    } else {
      this.axis.ticks(Math.max(this.inner_width / 50, 2));
    }

    this.x_axis = this.g.append('g');

    this.x_axis
      .attr('class', 'axis')
      .attr('id', 'x_axis')
      .attr('transform', 'translate(0,' + this.inner_height + ')')
      .call(this.axis);

    this.applyStyles();
  }

  resizeXAxis() {
    if ( this.data_type === 'time') {
      this.x_scale.domain(d3Array.extent(this.x_axis_values))
        .range([0, this.inner_width]);
    } else if ( this.data_type === 'time_band' ) {
      this.x_scale.domain(this.x_axis_values)
        .range([0, this.inner_width]);
    }

    this.axis = d3Axis.axisBottom(this.x_scale)
      .tickPadding( this.margin.bottom / 2 );

    if ( this.x_tick_size ) {
      this.axis.tickSizeInner(this.x_tick_size.inner)
        .tickSizeOuter(this.x_tick_size.outer);
    } else {
      this.axis.tickSizeInner(-this.inner_height);
      this.axis.tickSizeOuter(0);
    }

    if ( this.data_type === 'time' ) {
      this.axis.ticks(this.timeFunction());
    } else if ( this.data_type === 'time_band' ) {
      this.axis.tickFormat(d3TimeFormat.timeFormat('%m/%d'));
    } else if ( this.data_type === 'numeric' ) {
      this.axis.ticks(Math.max(this.inner_width / 50, 2));
    } else {
      this.axis.ticks(Math.max(this.inner_width / 50, 2));
    }

    this.x_axis = d3Select.select(this.container).select('#x_axis')
      .attr('transform', 'translate(0,' + this.inner_height + ')')
      .call(this.axis);

    this.applyStyles();
  }

  updateXAxis() {
    if ( this.data_type === 'time') {
      this.x_scale.domain(d3Array.extent(this.x_axis_values))
        .range([0, this.inner_width]);
    } else if ( this.data_type === 'time_band' ) {
      this.x_scale.domain(this.x_axis_values)
        .range([0, this.inner_width]);
    }

    this.axis = d3Axis.axisBottom(this.x_scale)
      .tickPadding( this.margin.bottom / 2 );

    if ( this.x_tick_size ) {
      this.axis.tickSizeInner(this.x_tick_size.inner)
        .tickSizeOuter(this.x_tick_size.outer);
    } else {
      this.axis.tickSizeInner(-this.inner_height);
      this.axis.tickSizeOuter(0);
    }

    if ( this.data_type === 'time' ) {
      this.axis.ticks(this.timeFunction());
    } else if ( this.data_type === 'time_band' ) {
      this.axis.tickFormat(d3TimeFormat.timeFormat('%m/%d'));
    } else if ( this.data_type === 'numeric' ) {
      this.axis.ticks(Math.max(this.inner_width / 50, 2));
    } else {
      this.axis.ticks(Math.max(this.inner_width / 50, 2));
    }

    if ( this.use_animation === true ) {
      this.x_axis = d3Select.select(this.container).select('#x_axis')
        .transition().duration(this.transition.update)
        .call(this.axis);
    } else {
      this.x_axis = d3Select.select(this.container).select('#x_axis')
        .call(this.axis);
    }


    this.applyStyles();
  }

  ngOnInit() {
    this.getData();
    this.getOffset();
    this.drawXAxis();
    resEvent(this.container, () => {
      this.getOffset();
      this.resizeXAxis();
    });
  }

  ngOnChanges() {
    this.getData();
    this.getOffset();
    this.updateXAxis();
  }
}
