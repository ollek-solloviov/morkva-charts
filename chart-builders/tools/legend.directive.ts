import {
  Directive,
  Input,
  OnInit
} from '@angular/core';

import * as d3Select from 'd3-selection'
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcLegend]'
})
export class LegendDirective implements OnInit{

  @Input() data;
  @Input() container;
  @Input() g;
  @Input() margin;
  @Input() color_scheme;

  private legend_values;
  private legend_scale;
  private legend_axis;
  private legend;
  private width;
  private inner_width;
  private height;
  private inner_height;

  constructor() { }

  getData() {
    this.legend_values = [];
    for ( const value of this.data ) {
      this.legend_values.push(value.label);
    }
  }

  getOffset() {
    this.width = this.container.offsetWidth;
    this.inner_width = this.width - this.margin.left - this.margin.right;
    this.height = this.container.offsetHeight;
    this.inner_height = this.height - this.margin.top - this.margin.bottom;
  }

  applyStyles() {
    this.legend.selectAll('path').remove();
  }

  drawLegendScale() {
    this.getData();
    this.getOffset();

    this.legend_scale = d3Scale.scaleBand();

    this.legend_scale.range([0, this.inner_width]).domain(this.legend_values);

    this.legend_axis = d3Axis.axisTop(this.legend_scale);

    this.legend = this.g.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(0, ' + - this.margin.top / 2 + ')')
      .call(this.legend_axis);

    this.legend.selectAll('text')
      .style('font-weight', 'bold')
      .style('font-size', 12 + 'px');

    this.legend.selectAll('line').remove();

    this.legend.selectAll('.tick')
      .each(
        function() {
          d3Select.select(this).append('circle')
            .attr('r', 5);
        })
      .attr('fill', (d, i) => this.color_scheme[i]);

    this.legend
      .selectAll('.tick')
      .attr('cursor', 'pointer')
      .on('mouseover', (d, i) => this.mouseOver(i));
    this.legend.selectAll('.tick')
      .on('mouseout', () => this.mouseOut() );

    this.applyStyles();
  }

  mouseOver(i) {
    this.g.selectAll('.data_visual')
      .attr('opacity', 0.2)
      .filter('#data' + (i + 1)).attr('opacity', 1);
  }

  mouseOut() {
    this.g.selectAll('.data_visual')
      .attr('opacity', 1);
  }

  resizeLegendScale() {
    this.getOffset();
    this.legend_scale.range([0, this.inner_width])
      .domain(this.legend_values);
    this.legend_axis = d3Axis.axisTop(this.legend_scale);
    this.legend.call(this.legend_axis);
    this.applyStyles();
  }

  ngOnInit() {
    this.drawLegendScale();
    resEvent(this.container, () => {
      this.resizeLegendScale();
    });
  }

}
