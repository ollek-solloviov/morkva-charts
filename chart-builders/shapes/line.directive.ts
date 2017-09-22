import {
  Directive,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import {Location} from '@angular/common';

import * as d3Shape from 'd3-shape';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcLine]',
})
export class LineDirective implements OnInit, OnChanges {

  // Data
  @Input() data: any;

  // Offset properties
  @Input() container: any;
  @Input() margin: any;
  @Input() g: any;
  @Input() use_hash_location: boolean;

  // line draw properties;
  @Input() x_scale: any;
  @Input() y_scale: any;
  private line_shape_0;
  private line_shape;
  private line_group;
  private line;

  // line styles
  @Input() line_type: string;
  @Input() color_theme: any;
  @Input() line_width: number;
  @Input() line_opacity: number;
  @Input() use_gradient: boolean;
  @Input() gradient_theme: any;
  @Input() use_shadow: boolean;
  @Input() use_animation: boolean;
  @Input() transition: any;

  constructor(
    private location: Location
  ) { }

  genLine() {
    if ( this.use_animation === true ) {
      this.line_shape_0 = d3Shape.line()
        .curve(d3Shape.curveCatmullRom)
        .x((d: any) => this.x_scale(parseInt(d.date, 10)))
        .y((d: any) => this.y_scale(0));
    }

    this.line_shape = d3Shape.line();

    if ( this.line_type === 'linear' ) {
      this.line_shape
        .curve(d3Shape.curveLinear);
    } else if ( this.line_type === 'catmull_rom') {
      this.line_shape
        .curve(d3Shape.curveCatmullRom);
    }

    this.line_shape.x((d: any) => this.x_scale(parseInt(d.date, 10)));
    this.line_shape.y((d: any) => this.y_scale(parseInt(d.value, 10)));

    this.line_group = this.g.append('g')
      .attr('class', 'lines');

    let index = 0;
    let line_index = 1;
    for ( const value of this.data ) {
      this.line = this.line_group
        .append('path')
        .datum(value.data)
        .attr('opacity', this.line_opacity)
        .attr('class', 'line data_visual')
        .attr('stroke-width', this.line_width)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('fill', 'none')
        .attr('id', 'data' + line_index++);

      if ( this.use_gradient === true && this.use_hash_location === false ) {
        this.line
          .attr('stroke', 'url(' + this.location.path() + '#' + this.gradient_theme.name  + '_' + index + ')');
      } else if ( this.use_gradient === true && this.use_hash_location === true ) {
        this.line
          .attr('stroke', 'url(#' + this.gradient_theme.name  + '_' + index + ')');
      } else {
        this.line
          .attr('stroke', this.color_theme[index]);
      }

      if ( this.use_shadow === true && this.use_hash_location === false ) {
        this.line
          .attr('filter', 'url(' + this.location.path() + '#shadow)');
      } else if ( this.use_shadow === true && this.use_hash_location === true ) {
        this.line
          .attr('filter', 'url(#shadow)');
      }

      if ( this.use_animation === true ) {
        this.line
          .attr('d', this.line_shape_0)
          .transition().duration(this.transition.appear)
          .attr('d', this.line_shape(value.data));
      } else {
        this.line
          .attr('d', this.line_shape(value.data));
      }

      if ( this.use_gradient === true ) {
        if ( index < (this.gradient_theme.colors.length - 1) ) {
          index++;
        } else {
          index = 0;
        }
      } else {
        if ( index < (this.color_theme.length - 1) ) {
          index++;
        } else {
          index = 0;
        }
      }
    }
  }

  resizeLine() {
    let line_index = 1;
    for ( const value of this. data ) {
      if ( this.use_animation === true ) {
        this.line_group
          .select('#data' + line_index)
          .transition().duration(0)
          .attr('d', this.line_shape(value.data));

      } else {
        this.line_group
          .select('#data' + line_index)
          .attr('d', this.line_shape(value.data));
      }
      line_index++;
    }
  }

  updateLine() {
    this.line_shape = d3Shape.line();

    if ( this.line_type === 'linear' ) {
      this.line_shape
        .curve(d3Shape.curveLinear);
    } else if ( this.line_type === 'catmull_rom') {
      this.line_shape
        .curve(d3Shape.curveCatmullRom);
    }

    this.line_shape.x((d: any) => this.x_scale(parseInt(d.date, 10)));
    this.line_shape.y((d: any) => this.y_scale(parseInt(d.value, 10)));

    this.line_group = this.g.select('.lines');

    let line_index = 1;
    for ( const value of this. data ) {
      if ( this.use_animation === true ) {
        this.line_group
          .select('#data' + line_index)
          .transition().duration(this.transition.update)
          .attr('d', this.line_shape(value.data));
      } else {
        this.line_group
          .select('#data' + line_index)
          .attr('d', this.line_shape(value.data));
      }
      line_index++;
    }
  }

  ngOnInit() {
    if ( this.use_animation === true ) {
      setTimeout(
        () => {
          this.genLine();
        }, 500
      );
    } else {
      this.genLine();
    }
    resEvent(this.container, () => {
      this.resizeLine();
    });
    console.log(this.location.path());
  }

  ngOnChanges() {
    this.updateLine();
  }

}
