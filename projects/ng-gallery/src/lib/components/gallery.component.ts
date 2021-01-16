import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList
} from '@angular/core';
import { Subject } from 'rxjs';
import { CarouselItemDirective } from '../carousel/carousel-item';
import { CarouselItem } from '../carousel/carousel.model';
import { GalleryRef } from '../services/gallery-ref';
import { GalleryState } from '../models/gallery.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['../styles/gallery.scss'],
  template: `
    <gallery-core [state]="galleryRef?.state$ | async"
                  [config]="getConfig()"
                  (action)="onAction($event)"></gallery-core>
  `
})
export class GalleryComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  /** Carousel ref */
  galleryRef = new GalleryRef();

  @Input() id: string;
  @Input() nav: boolean;
  @Input() dots: boolean;
  @Input() loop: boolean;
  @Input() thumb: boolean;
  @Input() zoomOut: number;
  @Input() counter: boolean;
  @Input() dotsSize: number;
  @Input() autoPlay: boolean;
  @Input() gestures: boolean;
  @Input() thumbWidth: number;
  @Input() thumbHeight: number;
  @Input() disableThumb: boolean;
  @Input() panSensitivity: number;
  @Input() playerInterval: number;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() thumbTemplate: TemplateRef<any>;
  @Input() thumbMode: 'strict' | 'free';
  @Input() imageSize: 'cover' | 'contain';
  @Input() dotsPosition: 'top' | 'bottom';
  @Input() counterPosition: 'top' | 'bottom';
  @Input() slidingDirection: 'horizontal' | 'vertical';
  @Input() thumbPosition: 'top' | 'left' | 'right' | 'bottom';

  @Input() perPage: number = 1;

  @Output() playingChange = new EventEmitter<GalleryState>();
  @Output() indexChange = new EventEmitter<GalleryState>();
  @Output() itemsChange = new EventEmitter<GalleryState>();

  private destroyed$ = new Subject();

  /** Carousel items reference */
  @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItem>;

  getConfig() {
    return {
      nav: this.nav,
      dots: this.dots,
      loop: this.loop,
      thumb: this.thumb,
      zoomOut: this.zoomOut,
      counter: this.counter,
      autoPlay: this.autoPlay,
      gestures: this.gestures,
      dotsSize: this.dotsSize,
      imageSize: this.imageSize,
      thumbMode: this.thumbMode,
      thumbWidth: this.thumbWidth,
      thumbHeight: this.thumbHeight,
      disableThumb: this.disableThumb,
      dotsPosition: this.dotsPosition,
      itemTemplate: this.itemTemplate,
      thumbTemplate: this.thumbTemplate,
      thumbPosition: this.thumbPosition,
      panSensitivity: this.panSensitivity,
      playerInterval: this.playerInterval,
      counterPosition: this.counterPosition,
      slidingDirection: this.slidingDirection
    };
  }

  onAction(i: string | number) {
    switch (i) {
      case 'next':
        this.galleryRef.next();
        break;
      case 'prev':
        this.galleryRef.prev();
        break;
      default:
        this.galleryRef.set(i as number);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.galleryRef.configure(this.getConfig());
  }

  ngOnInit() {
    // this.galleryRef.configure(this.getConfig());

    // Activate player listener
    // this.galleryRef.activatePlayer().pipe(takeUntil(this.destroyed$)).subscribe();

    // Subscribes to events on demand
    if (this.indexChange.observers.length) {
      this.galleryRef.activeChanged.pipe(takeUntil(this.destroyed$)).subscribe((state: GalleryState) => this.indexChange.emit(state));
    }
    if (this.itemsChange.observers.length) {
      this.galleryRef.loadChanged.pipe(takeUntil(this.destroyed$)).subscribe((state: GalleryState) => this.itemsChange.emit(state));
    }
    if (this.playingChange.observers.length) {
      this.galleryRef.playChanged.pipe(takeUntil(this.destroyed$)).subscribe((state: GalleryState) => this.playingChange.emit(state));
    }

    // Start playing if auto-play is set to true
    if (this.autoPlay) {
      this.play();
    }

    // this.galleryRef.state.subscribe(x => console.log('gallery state:', x));
  }

  ngAfterViewInit() {
    this.items.notifyOnChanges();
    this.items.changes.subscribe(() => {
      // Load carousel items
      this.galleryRef.load(this.items.toArray());
    });

    this.galleryRef.configure({
      loop: this.loop,
      perPage: this.perPage,
      // playSpeed: this.playSpeed,
      // playReverse: this.playReverse,
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.galleryRef.destroy();
  }

  onThumbClick(i: number) {
    this.galleryRef.set(i);
  }

  next() {
    this.galleryRef.next();
  }

  prev() {
    this.galleryRef.prev();
  }

  set(i: number) {
    this.galleryRef.set(i);
  }

  reset() {
    this.galleryRef.reset();
  }

  play(speed?: number) {
    this.galleryRef.play(speed);
  }

  stop() {
    this.galleryRef.stop();
  }
}
