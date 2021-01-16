import { Directive, TemplateRef } from '@angular/core';
import { CarouselItem } from './carousel.model';

@Directive({
  selector: 'ng-template[carouselItem]'
})
export class CarouselItemDirective implements CarouselItem {
  index: number;

  constructor(public template: TemplateRef<any>) {
  }
}
