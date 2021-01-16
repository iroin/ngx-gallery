import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GalleryConfig } from '../models/config.model';
import { GalleryComponent } from './gallery.component';
import { GalleryState } from '../models/gallery.model';

@Component({
  selector: 'gallery-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="g-items-container">
      <horizontal-carousel size="full"
                           [select]="select$ | async"
                           [items]="state.pages"
                           (next)="next()"
                           (prev)="prev()">
      </horizontal-carousel>
    </div>
    <ng-content></ng-content>
  `
})
export class GallerySliderComponent {

  /** Gallery state */
  @Input() state: GalleryState;

  /** Gallery config */
  @Input() config: GalleryConfig;

  /** Stream that emits when the active item should change */
  @Output() action = new EventEmitter<string | number>();

  select$: Observable<number> = this.host.galleryRef.activeChanged.pipe(map(state => state.activePage));

  constructor(public host: GalleryComponent) {
  }

  next() {
    this.action.emit('next');
  }

  prev() {
    this.action.emit('prev');
  }

}
