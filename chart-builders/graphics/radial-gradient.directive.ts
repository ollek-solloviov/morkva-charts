import {Directive, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[mcRadialGradient]'
})
export class RadialGradientDirective implements OnInit {

  @Input() g;
  @Input() gradient_theme: any;
  private gradient;

  constructor() { }

  drawGradient() {
    let gradient_index = 0;
    for ( const color of this.gradient_theme.colors) {
      this.gradient = this.g.append('defs')
        .append('radialGradient').attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '120%')
        .attr('id', this.gradient_theme.name + '_' + gradient_index++)
        .attr('spreadMethod', 'pad');

      this.gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color[0]);

      this.gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color[1]);
    }
  }

  ngOnInit() {
    this.drawGradient();
  }

}
