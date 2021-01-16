import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SliderBase } from './slider';
import { CAROUSEL_ORIENTATION } from '../carousel.model';

declare let Hammer: any;

@Component({
  selector: 'horizontal-slider',
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HorizontalSlider extends SliderBase {

  get orientation(): string {
    return CAROUSEL_ORIENTATION.Horizontal;
  }

  get itemSize(): number {
    if (this.size === 'full') {
      return this.itemWidth;
    }
    return this.itemWidth;
    // return 50;
  }

  constructor(el: ElementRef,
              zone: NgZone,
              cd: ChangeDetectorRef,
              // @Inject(DOCUMENT) document: Document,
              @Inject(PLATFORM_ID) platform: any) {
    super(el, zone, cd, platform);
  }

  /**
   * Activate gestures
   */
  protected _activateGestures() {
    this._hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    // Set _panOffset for sliding on pan start event
    this._hammer.on('panstart', () => {
      this._panOffset = this.viewPort.measureScrollOffset('start');
    });

    this._hammer.on('panend', (e) => {
      // if (!(e.direction & Hammer.DIRECTION_HORIZONTAL && e.offsetDirection & Hammer.DIRECTION_HORIZONTAL)) return;
      this._panEnd(e.velocityX, e.deltaX);
    });

    // Activate the slider
    this._hammer.on('panmove', (e) => {
      this.viewPort.scrollToOffset(-(e.deltaX - this._panOffset));
    });
  }
}
