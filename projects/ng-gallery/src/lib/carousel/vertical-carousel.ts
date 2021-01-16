import { ChangeDetectionStrategy, Component, ElementRef, Inject, Optional } from '@angular/core';
import { CAROUSEL_CONFIG, CarouselConfig } from './carousel.model';
import { Carousel } from './carousel';

@Component({
  selector: 'vertical-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./carousel.scss'],
  template: `
    <div class="carousel">
      <vertical-slider [panSensitivity]="panSensitivity"
                       [animated]="animated"
                       [gestures]="gestures"
                       [duration]="duration"
                       [state]="carouselRef.state$ | async"
                       (next)="nextPage()"
                       (prev)="prevPage()">
      </vertical-slider>
      <ng-content select="carousel-dots"></ng-content>
      <ng-content select="carousel-nav"></ng-content>
    </div>
  `
})
export class VerticalCarousel extends Carousel {
  constructor(@Optional() @Inject(CAROUSEL_CONFIG) config: CarouselConfig, public el: ElementRef) {
    super(config);
  }
}
