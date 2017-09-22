import {
  Directive,
  Input,
  OnChanges,
  OnInit
} from '@angular/core';
import { Location } from '@angular/common';

import * as d3Shape from 'd3-shape';
import * as d3Select from 'd3-selection';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcArea]'
})
export class AreaDirective implements OnInit, OnChanges {

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
  private area_shape_0;
  private area_shape;
  private area_group;
  private area;

  // Area styles
  @Input() area_type: string;
  @Input() color_theme: string;
  @Input() area_opacity: number;
  @Input() use_gradient: boolean;
  @Input() gradient_theme: any;
  @Input() use_shadow: boolean;
  @Input() use_animation: boolean;
  @Input() transition: any;

  constructor(
    private location: Location
  ) { }

  drawArea() {
    if ( this.use_animation === true ) {
      this.area_shape_0 = d3Shape.area()
        .curve(d3Shape.curveCatmullRom)
        .x((d: any) => this.x_scale(parseInt(d.date, 10)))
        .y((d: any) => this.y_scale(0));
    }

    this.area_shape = d3Shape.area();

    if ( this.area_type === 'curveLinear' ) {
      this.area_shape
        .curve(d3Shape.curveLinear);
    } else if ( this.area_type === 'curveCatmullRom') {
      this.area_shape
        .curve(d3Shape.curveCatmullRom);
    } else if ( this.area_type === 'curveBasis') {
      this.area_shape
      .curve(d3Shape.curveBasis);
    }

    this.area_shape.x((d: any) => this.x_scale(parseInt(d.date, 10)));
    this.area_shape.y1((d: any) => this.y_scale(parseInt(d.value, 10)));
    this.area_shape.y0(this.y_scale(0));


    this.area_group = this.g.append('g')
      .attr('class', 'areas');
    let index = 0;
    let area_index = 1;
    for ( const value of this.data ) {
      this.area = this.area_group
        .append('path')
        .datum(value.data)
        .attr('opacity', this.area_opacity)
        .attr('class', 'area data_visual')
        .attr('id', 'data' + area_index++);

      if ( this.use_gradient === true && this.use_hash_location === false ) {
        this.area
          .attr('fill', 'url(' + this.location.path() + '#' + this.gradient_theme.name  + '_' + index + ')');
      } else if ( this.use_gradient === true && this.use_hash_location === true ) {
        this.area
          .attr('fill', 'url(#' + this.gradient_theme.name  + '_' + index + ')');
      } else {
        this.area
          .attr('fill', this.color_theme[index]);
      }

      if ( this.use_shadow === true && this.use_hash_location === false ) {
        this.area
          .attr('filter', 'url(' + this.location.path() + '#shadow)');
      } else if ( this.use_shadow === true && this.use_hash_location === true ) {
        this.area
          .attr('filter', 'url(#shadow)');
      }

      if ( this.use_animation === true ) {
        this.area
          .attr('d', this.area_shape_0)
          .transition().duration(this.transition.appear)
          .attr('d', this.area_shape(value.data));

      } else {
        this.area
          .attr('d', this.area_shape);
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

  resizeArea() {
    this.area_shape.y0(this.y_scale(0));
    let area_index = 1;
    for ( const value of this. data ) {
      this.area_group
        .select('#data' + area_index++)
        .attr('d', this.area_shape(value.data));
    }
  }

  updateArea() {
    this.area_shape = d3Shape.area();

    if ( this.area_type === 'curveLinear' ) {
      this.area_shape
        .curve(d3Shape.curveLinear);
    } else if ( this.area_type === 'curveCatmullRom') {
      this.area_shape
        .curve(d3Shape.curveCatmullRom);
    } else if ( this.area_type === 'curveBasis') {
      this.area_shape
        .curve(d3Shape.curveBasis);
    }

    this.area_shape.x((d: any) => this.x_scale(parseInt(d.date, 10)));
    this.area_shape.y1((d: any) => this.y_scale(parseInt(d.value, 10)));
    this.area_shape.y0(this.y_scale(0));

    let area_index = 1;
    for ( const value of this. data ) {
      if ( this.use_animation === true ) {
        d3Select.select(this.container).select('#data' + area_index++)
          .transition().duration(this.transition.update)
          .attr('d', this.area_shape(value.data));
      } else {
        d3Select.select(this.container).select('#data' + area_index++)
          .attr('d', this.area_shape(value.data));
      }
    }
  }

  ngOnInit() {
    if ( this.use_animation === true ) {
      setTimeout(
        () => {
          this.drawArea();
        }, 500
      );
    } else {
      this.drawArea();
    }
    resEvent(this.container, () => {
      this.resizeArea();
    });
  }

  ngOnChanges() {
    this.updateArea();
  }

}
