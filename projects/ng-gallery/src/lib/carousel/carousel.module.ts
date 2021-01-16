import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
// import { PortalModule } from '@angular/cdk/portal';

// import {
//   CarouselNav,
//   CarouselNavNext,
//   CarouselNavNextButton,
//   CarouselNavPrev,
//   CarouselNavPrevButton
// } from './carousel-nav/carousel-nav.component';
import { HorizontalCarousel } from './horizontal-carousel';
import { VerticalCarousel } from './vertical-carousel';
import { HorizontalSlider } from './slider/horizontal-slider';
import { VerticalSlider } from './slider/vertical-slider';
import { CarouselItemDirective } from './carousel-item';
import { SliderBase } from './slider/slider';
import { Carousel } from './carousel';
// import { CarouselDots, CarouselDot } from './carousel-dots/carousel-dots.component';
// import { TapClick } from './directives/tap-click.directive';
// import { CarouselNavButton } from './carousel-nav/carousel-nav-button';
// import { CarouselLayerComponent } from './carousel-layer/carousel-layer.component';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule
  ],
  declarations: [
    CarouselItemDirective,
    HorizontalCarousel,
    VerticalCarousel,
    VerticalSlider,
    HorizontalSlider,
    // TapClick,
    // CarouselDots,
    // CarouselNav,
    // CarouselNavNext,
    // CarouselNavNextButton,
    // CarouselNavPrev,
    // CarouselNavPrevButton,
    // CarouselDot,
    // CarouselNavButton,
    // CarouselLayerComponent
  ],
  exports: [
    HorizontalCarousel,
    VerticalCarousel,
    CarouselItemDirective,
    VerticalSlider,
    HorizontalSlider,
    // CarouselDots,
    // TapClick,
    // CarouselNav,
    // CarouselNavNext,
    // CarouselNavNextButton,
    // CarouselNavPrev,
    // CarouselNavPrevButton,
    // CarouselDot,
    // CarouselLayerComponent
  ]
})
export class CarouselModule {
}
