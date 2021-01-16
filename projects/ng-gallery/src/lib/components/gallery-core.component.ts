import { Component, Input, Output, HostBinding, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { GalleryConfig } from '../models/config.model';
import { GalleryState } from '../models/gallery.model';

@Component({
  selector: 'gallery-core',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="g-box">
      <gallery-slider [state]="state"
                      [config]="config"
                      (action)="action.emit($event)">

        <gallery-nav *ngIf="config.nav && state.total > 1"
                     [state]="state"
                     [config]="config"
                     (action)="action.emit($event)">
        </gallery-nav>

      </gallery-slider>
    </div>
  `
})
export class GalleryCoreComponent {

  @Input() state: GalleryState;
  @Input() config: GalleryConfig;
  @Output() action = new EventEmitter<string | number>();

  /** Set thumbnails position */
  @HostBinding('attr.thumbPosition') get thumbPosition(): 'top' | 'left' | 'right' | 'bottom' {
    return this.config.thumbPosition;
  }

  /** Set sliding direction */
  @HostBinding('attr.slidingDirection') get slidingDirection(): 'horizontal' | 'vertical' {
    return this.config.slidingDirection;
  }

  /** Disable thumbnails clicks */
  @HostBinding('attr.disableThumb') get disableThumb(): boolean {
    return this.config.disableThumb;
  }

  /** Set gallery image size */
  @HostBinding('attr.imageSize') get imageSize(): 'cover' | 'contain' {
    return this.config.imageSize;
  }

  /** Set gallery dots position */
  @HostBinding('attr.dotsPosition') get dotsPosition(): 'top' | 'bottom' {
    return this.config.dotsPosition;
  }

  /** Set gallery counter position */
  @HostBinding('attr.counterPosition') get counterPosition(): 'top' | 'bottom' {
    return this.config.counterPosition;
  }

}
