import {
  Directive,
  Input, OnChanges, OnInit
} from '@angular/core';

import * as d3Select from 'd3-selection';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcYAxisBasic]'
})
export class YAxisBasicDirective implements OnInit, OnChanges {

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
  @Input() enable_negative_values = true;
  private y_axis_values;
  private negative;

  // Axis draw properties;
  @Input() time_type;
  @Input() y_scale;
  @Input() nice_y_scale;
  @Input() nice_step;
  @Input() y_tick_size;
  private axis;
  private y_axis;

  // Axis style
  @Input() y_axis_params = {
    dasharray: '0, 0',
    line_width: 1,
    line_opacity: 1,
    line_color: 'black',
    text_opacity: 1,
    text_color: 'black'
  };
  @Input() show_y_axis;
  @Input() remove_domain;
  @Input() use_animation;
  @Input() transition;

  constructor() { }

  getOffset() {
    this.width = this.container.offsetWidth;
    this.inner_width = this.width - this.margin.left - this.margin.right;
    this.height = this.container.offsetHeight;
    this.inner_height = this.height - this.margin.top - this.margin.bottom;
  }

  getData() {
    this.y_axis_values = [];
    this.negative = [];

    if ( this.enable_negative_values === true ) {
      for ( const value of this.data ) {
        value.data.map((d) => {
          this.y_axis_values.push(d.value);
          if (d.value < 0) {
            this.negative.push(d.value);
          }
        });
      }
    } else {
      for ( const value of this.data ) {
        value.data.map((d) => {
          this.y_axis_values.push(d.value);
          if (d.value < 0) {
            this.negative.push(d.value);
          }
        });
      }
    }
  }

  applyStyles() {
    this.y_axis = d3Select.select(this.container).select('#y_axis');

    this.y_axis.selectAll('line')
      .attr('stroke-dasharray', this.y_axis_params.dasharray)
      .attr('stroke-width', this.y_axis_params.line_width)
      .attr('opacity', this.y_axis_params.line_opacity)
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke', this.y_axis_params.line_color);

    this.y_axis.selectAll('.domain')
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke-linecap', 'square')
      .attr('stroke',  this.y_axis_params.line_color);

    this.y_axis.selectAll('text')
      .attr('opacity', this.y_axis_params.text_opacity)
      .attr('fill', this.y_axis_params.text_color  );

    if ( this.show_y_axis === false ) {
      this.y_axis.selectAll('line').remove();
      this.y_axis.selectAll('.domain').remove();
      this.y_axis.selectAll('text').remove();
    }
    if ( this.remove_domain === true ) {
      this.y_axis.selectAll('.domain').remove();
    }
  }

  drawYAxis() {
    if ( this.negative.length === this.y_axis_values.length ) {
      this.y_scale.domain([0, d3Array.min(this.y_axis_values)])
        .range([0, this.inner_height]);
    } else if ( this.negative.length === 0 ) {
      this.y_scale.domain([0, d3Array.max(this.y_axis_values)])
        .range([this.inner_height, 0]);
    } else {
      this.y_scale.domain(d3Array.extent(this.y_axis_values))
        .rangeRound([this.inner_height, 0]);
    }

    if ( this.nice_y_scale === true ) {
      this.y_scale.nice(this.nice_step);
    }

    this.axis = d3Axis.axisLeft(this.y_scale)
      .tickSize(-this.inner_width)
      .tickPadding( this.margin.left / 2 )
      .ticks(Math.max(this.inner_height / 50, 2));

    if ( this.y_tick_size ) {
      this.axis
        .tickSizeInner(this.y_tick_size.inner)
        .tickSizeOuter(this.y_tick_size.outer);
    } else {
      this.axis.tickSizeInner(-this.inner_width);
      this.axis.tickSizeOuter(0);
    }

    this.y_axis = this.g.append('g')
      .attr('class', 'axis')
      .attr('id', 'y_axis')
      .call(this.axis);

    this.applyStyles();
  }

  resizeXAxis() {
    if ( this.negative.length === this.y_axis_values.length ) {
      this.y_scale.domain([0, d3Array.min(this.y_axis_values)])
        .range([0, this.inner_height]);
    } else if ( this.negative.length === 0 ) {
      this.y_scale.domain([0, d3Array.max(this.y_axis_values)])
        .range([this.inner_height, 0]);
    } else {
      this.y_scale.domain(d3Array.extent(this.y_axis_values))
        .rangeRound([this.inner_height, 0]);
    }

    if ( this.nice_y_scale === true ) {
      this.y_scale.nice(this.nice_step);
    }

    this.axis = d3Axis.axisLeft(this.y_scale)
      .tickPadding( this.margin.bottom / 2 )
      .ticks(Math.max(this.inner_height / 50, 2));

    if ( this.y_tick_size ) {
      this.axis
        .tickSizeInner(this.y_tick_size.inner)
        .tickSizeOuter(this.y_tick_size.outer);
    } else {
      this.axis.tickSizeInner(-this.inner_width);
      this.axis.tickSizeOuter(0);
    }

    this.y_axis = d3Select.select(this.container).select('#y_axis')
      .call(this.axis);

    this.applyStyles();
  }

  updateXAxis() {
    if ( this.negative.length === this.y_axis_values.length ) {
      this.y_scale.domain([0, d3Array.min(this.y_axis_values)])
        .range([0, this.inner_height]);
    } else if ( this.negative.length === 0 ) {
      this.y_scale.domain([0, d3Array.max(this.y_axis_values)])
        .range([this.inner_height, 0]);
    } else {
      this.y_scale.domain(d3Array.extent(this.y_axis_values))
        .rangeRound([this.inner_height, 0]);
    }
    if ( this.nice_y_scale === true ) {
      this.y_scale.nice(this.nice_step);
    }
    this.axis = d3Axis.axisLeft(this.y_scale)
      .tickPadding( this.margin.bottom / 2 )
      .ticks(Math.max(this.inner_height / 50, 2));

    if ( this.y_tick_size ) {
      this.axis
        .tickSizeInner(this.y_tick_size.inner)
        .tickSizeOuter(this.y_tick_size.outer);
    } else {
      this.axis.tickSizeInner(-this.inner_width);
      this.axis.tickSizeOuter(0);
    }

    if ( this.use_animation === true ) {
      this.y_axis = d3Select.select(this.container).select('#y_axis')
        .transition().duration(this.transition.update)
        .call(this.axis);
    } else {
      this.y_axis = d3Select.select(this.container).select('#y_axis')
        .call(this.axis);
    }

    this.applyStyles();
  }

  ngOnInit() {
    this.getOffset();
    this.getData();
    this.drawYAxis();
    resEvent(this.container, () => {
      this.getOffset();
      this.resizeXAxis();
    });
  }

  ngOnChanges() {
    this.getOffset();
    this.getData();
    this.updateXAxis();
  }
}
