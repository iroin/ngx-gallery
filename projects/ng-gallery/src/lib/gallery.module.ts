import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { GalleryConfig, GALLERY_CONFIG } from './models/config.model';

import { GalleryComponent } from './components/gallery.component';
import { GalleryNavComponent } from './components/gallery-nav.component';
import { GalleryCoreComponent } from './components/gallery-core.component';
import { GalleryDotsComponent } from './components/gallery-dots.component';
import { GalleryThumbsComponent } from './components/gallery-thumbs.component';
import { GallerySliderComponent } from './components/gallery-slider.component';
import { GalleryCounterComponent } from './components/gallery-counter.component';

import { GalleryItemComponent } from './components/gallery-item.component';
import { GalleryThumbComponent } from './components/gallery-thumb.component';
import { GalleryImageComponent } from './components/templates/gallery-image.component';
import { GalleryVideoComponent } from './components/templates/gallery-video.component';
import { GalleryIframeComponent } from './components/templates/gallery-iframe.component';

import { LazyImage } from './directives/lazy-image';
import { TapClick } from './directives/tap-click';

import { CarouselModule } from './carousel/carousel.module';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    CarouselModule
  ],
  declarations: [
    GalleryComponent,
    GalleryNavComponent,
    GalleryDotsComponent,
    GalleryCoreComponent,
    GallerySliderComponent,
    GalleryCounterComponent,
    GalleryThumbsComponent,
    GalleryThumbComponent,
    GalleryItemComponent,
    GalleryImageComponent,
    GalleryVideoComponent,
    GalleryIframeComponent,
    LazyImage,
    TapClick
  ],
  exports: [
    GalleryComponent,
    GalleryImageComponent,
    LazyImage,
    TapClick,
    CarouselModule
  ]
})
export class GalleryModule {
  static withConfig(config: GalleryConfig): ModuleWithProviders<GalleryModule> {

    return {
      ngModule: GalleryModule,
      providers: [
        {
          provide: GALLERY_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
