import {
  Directive,
  Input,
  OnInit
} from '@angular/core';

import * as d3Select from 'd3-selection';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Array from 'd3-array';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcTooltip]'
})
export class TooltipDirective implements OnInit{

  @Input() container;
  @Input() margin;
  @Input() data;
  @Input() g;
  @Input() x_scale;
  @Input() y_scale;
  @Input() color_palette;

  private width;
  private inner_width;
  private height;
  private inner_height;
  private color_index = 0;
  private bisectDate;
  private sortFunction;
  private parsed_data;

  private tooltip_wrapper;
  private tooltip_box;
  private tooltip_box_span;
  private tooltip_label_box;
  private tooltip_label;
  private tooltip_value_box;
  private tooltip_value;
  private tooltip_date;
  private tooltip_line;
  private tooltip_dot;
  private tooltip_index;
  private tooltip_values;

  private bisected_date;
  private bisected_index;
  private mouse_position;
  private mouse_x_position;

  private parse_date;

  private bd0;
  private bd1;
  private bd2;

  constructor() {
    this.sortFunction = function (a, b) {
      return a.date - b.date;
    };
    this.color_index = 0;

    this.parse_date = d3TimeFormat.timeFormat('%x');
  }

  getOffset() {
    this.width = this.container.offsetWidth;
    this.inner_width = this.width - this.margin.left - this.margin.right;
    this.height = this.container.offsetHeight;
    this.inner_height = this.height - this.margin.top - this.margin.bottom;
  }

  private genTooltipValues() {
    this.tooltip_values = [];
    let i = 0;
    for ( const value of this.data ) {
      const color = this.color_palette[i];
      if (i < this.color_palette.length - 1) {
        i++;
      } else {
        i = 0;
      }
      this.parsed_data = value.data.sort(this.sortFunction);
      this.tooltip_values.push(this.parsed_data[this.tooltip_index - 1]);
      this.tooltip_value = this.tooltip_value_box.selectAll('.tooltip_value')
        .data(this.tooltip_values);
      this.tooltip_value.enter()
        .append('span')
        .style('float', 'left')
        .style('clear', 'left')
        .style('padding', '5px 2em')
        .attr('class', 'tooltip_value');
      this.tooltip_value.text((d: any) => (parseFloat(d.value)).toFixed(2));
      this.tooltip_dot = this.g.selectAll('.tooltip_dot')
        .data(this.tooltip_values);
      this.tooltip_dot
        .enter()
        .append('circle')
        .attr('fill', '#fff')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('class', 'tooltip_dot');
      this.tooltip_dot
        .attr('r', 4)
        .attr('cy', (d) => (this.y_scale(parseInt(d.value, 10))) )
        .attr('transform', 'translate (' + this.x_scale(this.bd2) + ', 0) ');
      this.tooltip_label = this.tooltip_label_box.selectAll('.tooltip_label')
        .data(this.data);
      this.tooltip_label.enter()
        .append('span')
        .style('float', 'left')
        .style('clear', 'left')
        .style('padding', '5px 1em')
        .attr('class', 'tooltip_label');
      this.tooltip_label.text((d: any) => d.label);
    }
  }

  genTooltip() {
    this.bisectDate = d3Array.bisector((d: any) => d).left;
    this.tooltip_box = d3Select.select(this.container)
      .append('div')
      .style('display', 'none')
      .attr('class', 'tooltip_box')
      .style('top', this.inner_height / 2 + 'px')
      .style('position', 'absolute')
      .style('width', '200px')
      .style('z-index', '10000')
      .style('height', 'auto')
      .style('background-color', '#263238')
      .style('opacity', 1)
      .style('color', '#fff')
      .style('border-radius', '10px')
      .style('opacity', 0.8)
      .style('box-shadow', '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)');

    this.tooltip_box_span = this.tooltip_box.append('span')
      .style('position', 'absolute')
      .style('width', 0)
      .style('height', 0)
      .style('border-top', '10px solid transparent')
      .style('border-bottom', '10px solid transparent')
      .style('top', '40%');

    this.tooltip_date = this.tooltip_box
      .append('span')
      .attr('class', 'tooltip_date')
      .style('padding', '5px 2em')
      .style('float', 'left');

    this.tooltip_label_box = this.tooltip_box.append('div')
      .style('position', 'relative')
      .style('width', '100px')
      .style('clear', 'left')
      .style('float', 'left');

    this.tooltip_value_box = this.tooltip_box.append('div')
      .style('position', 'relative')
      .style('width', '100px')
      .style('float', 'left');

    this.tooltip_line = this.g.append('line')
      .attr('class', 'tooltip_line')
      .attr('stroke', 'darkgray')
      .attr('display', 'none')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '10, 5')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', this.inner_height);

    this.tooltip_wrapper = this.g.append('rect')
      .attr('class', 'tooltip_wrapper')
      .attr('width', this.inner_width)
      .attr('height', this.inner_height)
      .attr('opacity', 0)
      .attr('fill', 'black');

    this.tooltip_wrapper.on('mousemove', () => this.mouseMove());
    this.tooltip_wrapper.on('mouseout', (d) => this.mouseOut());
    this.tooltip_wrapper.on('mouseover', () => {
      this.tooltip_box.style('display', null);
      this.tooltip_line.attr('display', null);
      this.g.selectAll('.tooltip_dot').attr('display', null);
    });

    this.tooltip_box.append('span');
  }

  private mouseOut() {
    this.tooltip_box.style('display', 'none');
    this.tooltip_line.attr('display', 'none');
    this.g.selectAll('.tooltip_dot').attr('display', 'none');
  }

  private mouseMove () {
    this.bisected_date = [];
    this.mouse_position = d3Select.mouse(this.tooltip_wrapper.node());
    this.mouse_x_position = this.x_scale.invert(this.mouse_position[0]);

    for ( const value of this.data ) {
      value.data.forEach(
        (z) => {
          this.bisected_date.push(new Date(z.date));
        }
      );
    }
    this.bisected_index = this.bisectDate(this.bisected_date.sort(d3Array.ascending), this.mouse_x_position, 1);

    this.bd0 = this.bisected_date[this.bisected_index - 1];
    this.bd1 = this.bisected_date[this.bisected_index];

    this.bd2 = this.mouse_x_position - this.bd0 > this.bd1 - this.mouse_x_position ? this.bd1 : this.bd0;

    this.tooltip_line
      .attr('display', null)
      .attr('transform', 'translate (' + this.x_scale(this.bd2) + ', 0) ');

    this.tooltip_box
      .style('left', ( this.x_scale(this.bd2) + 80) + 'px');

    d3Select
      .selectAll('.tooltip_dot');


    this.tooltip_box_span
      .style('border-right', '10px solid #263238')
      .style('border-left', 'none')
      .style('left', -10 + 'px');

    if (this.mouse_position[0] >= this.inner_width - (this.inner_width / 3)) {
      this.tooltip_box
        .style('left', ( this.x_scale(this.bd2) - 200) + 'px');

      this.tooltip_box_span
        .style('border-left', '10px solid #263238')
        .style('border-right', 'none')
        .style('left', null)
        .style('right', -10 + 'px');
    }

    if (this.bd2 === this.bd0) {
      if (this.bisected_index  <= 1) {
        this.tooltip_index = 1;
      } else {
        this.tooltip_index = this.bisected_index / this.data.length;
      }
      this.tooltip_date.text(this.parse_date(this.bd2));
      this.genTooltipValues();
    }

    if (this.bd2 === this.bd1) {
      this.tooltip_index = this.bisected_index / this.data.length + 1;
      this.tooltip_date.text(this.parse_date(this.bd2));
      this.genTooltipValues();
    }
  }

  private resizeTooltip() {
    this.getOffset();
    this.tooltip_wrapper
      .attr('width', this.inner_width)
      .attr('height', this.inner_height);
  }

  ngOnInit() {
    this.getOffset();
    this.genTooltip();
    resEvent(this.container, () => {
      this.resizeTooltip();
    });
  }
}
