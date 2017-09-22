import {
  Directive,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[mcContainer]'
})
export class ContainerDirective implements OnInit {

  @Input() responsive;
  @Input() container_width;
  @Input() container_height;
  private container;

  constructor(
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.container = this.el.nativeElement;
    this.container.style.width = this.getWidth();
    this.container.style.height = this.getHeight();
    this.container.style.position = this.getPosition();
    this.container.style.top = 0;
    this.container.style.left = 0;
    this.container.style.overflow = 'hidden';
  }

  getWidth() {
    if (this.responsive === true) {
      return this.container_width + '%';
    } else {
      return this.container_width + 'px';
    }
  }

  getHeight() {
    if (this.responsive === true) {
      return this.container_height + '%';
    } else {
      return this.container_height + 'px';
    }
  }

  getPosition() {
    if (this.responsive === true) {
      return 'absolute';
    } else {
      return 'relative';
    }
  }

}
