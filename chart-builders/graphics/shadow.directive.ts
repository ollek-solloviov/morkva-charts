import {Directive, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[mcShadow]'
})
export class ShadowDirective implements OnInit {

  @Input() g: any;

  private shadow;
  private shadow_filter;
  private feMerge;

  constructor() {}

  drawShadow() {
    this.shadow = this.g.append('defs');
    this.shadow_filter = this.shadow.append('filter')
      .attr('id', 'shadow');

    this.shadow_filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3)
      .attr('result', 'blur');

    this.shadow_filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 0)
      .attr('dy', 1.5);

    this.feMerge = this.shadow_filter.append('feMerge');
    this.feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur');
    this.feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
  }

  ngOnInit() {
    this.drawShadow();
  }

}
