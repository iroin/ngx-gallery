import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SliderBase } from './slider';
import { CAROUSEL_ORIENTATION } from '../carousel.model';

declare let Hammer: any;

@Component({
  selector: 'vertical-slider',
  templateUrl: './slider.html',
  styleUrls: ['./slider.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalSlider extends SliderBase {

  get orientation(): string {
    return CAROUSEL_ORIENTATION.Vertical;
  }

  get itemSize(): number {
    return this.itemHeight;
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
    this._hammer.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

    // Set _panOffset for sliding on pan start event
    this._hammer.on('panstart', () => {
      this._panOffset = this.viewPort.measureScrollOffset('top');
    });

    this._hammer.on('panend', (e) => {
      // if (!(e.direction & Hammer.DIRECTION_UP && e.offsetDirection & Hammer.DIRECTION_VERTICAL)) return;
      this._panEnd(e.velocityY, e.deltaY);
    });

    // Activate the slider
    this._hammer.on('panmove', (e) => {
      this.viewPort.scrollToOffset(-(e.deltaY - this._panOffset));
    });
  }
}
