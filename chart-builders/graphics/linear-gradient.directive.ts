import {
  Directive,
  Input,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[mcLinearGradient]'
})
export class LinearGradientDirective implements OnInit {

  @Input() g;
  @Input() gradient_theme: any;
  private gradient;

  constructor() { }

  drawLinearGradient() {
    let gradient_index = 0;
    for ( const color of this.gradient_theme.colors) {
      this.gradient = this.g.append('defs')
        .append('linearGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('id', 'linear' + this.gradient_theme.name + '_' + gradient_index++)
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
    this.drawLinearGradient();
  }


}
