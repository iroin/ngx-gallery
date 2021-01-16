import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GalleryState } from '../models/gallery.model';

@Component({
  selector: 'gallery-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="g-counter">{{(state.activePage + 1) + '/' + state.pages.length}}</div>
  `
})
export class GalleryCounterComponent {
  @Input() state: GalleryState;
}
