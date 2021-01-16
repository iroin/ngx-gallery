import { ChangeDetectionStrategy, Component, ElementRef, Inject, Optional } from '@angular/core';
import { CAROUSEL_CONFIG, CarouselConfig } from './carousel.model';
import { Carousel } from './carousel';

@Component({
  selector: 'horizontal-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./carousel.scss'],
  template: `
    <div *ngIf="layout | async as layout"
         class="carousel"
         [ngClass]="layout.classes">
      <ng-content select="carousel-dots"></ng-content>
      <div class="carousel-slider">
        <div *ngIf="layout.prev" class="g-nav g-prev">
          <ng-container *ngTemplateOutlet="layout.prev"></ng-container>
        </div>
        <horizontal-slider [panSensitivity]="panSensitivity"
                           [animated]="animated"
                           [gestures]="gestures"
                           [duration]="duration"
                           [state]="carouselRef.state$ | async"
                           [carouselRef]="carouselRef"
                           (next)="nextPage()"
                           (prev)="prevPage()">
        </horizontal-slider>
        <div *ngIf="layout.next" class="g-nav g-next">
          <ng-container *ngTemplateOutlet="layout.next"></ng-container>
        </div>
      </div>
    </div>
  `
})
export class HorizontalCarousel extends Carousel {
  constructor(@Optional() @Inject(CAROUSEL_CONFIG) config: CarouselConfig, public el: ElementRef) {
    super(config);
  }
}
