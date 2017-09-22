import {
  Directive,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';

import * as d3Select from 'd3-selection';
import * as resEvent from 'element-resize-event';

@Directive({
  selector: '[mcSvg]'
})
export class SvgDirective implements OnInit {

  // Offset properties
  @Input() container;
  @Input() type;
  private svg;
  private width;
  private height;

  constructor(
    private el: ElementRef
  ) { }

  drawChartSVG() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.svg = d3Select.select(this.el.nativeElement)
      .attr('class', 'chart')
      .attr('id', this.type + '_chart')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  resizeChartSvg() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
  }

  ngOnInit() {
    this.drawChartSVG();
    resEvent(this.container, () => {
      this.resizeChartSvg();
    });
  }
}
