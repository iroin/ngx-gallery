import {
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  ContentChildren,
  QueryList,
  EventEmitter,
  TemplateRef,
  Component,
  Directive, OnChanges, SimpleChanges
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarouselRef } from './carousel-ref';
import { CarouselItemDirective } from './carousel-item';
import { CarouselItem, CarouselConfig, CarouselState, CarouselMode, CAROUSEL_MODE } from './carousel.model';

export interface CarouselLayout {
  next?: TemplateRef<any>;
  prev?: TemplateRef<any>;
  classes?: {
    navCompact?: boolean;
    dotsCompact?: boolean;
    dotsPosition?: string;
  };
}

const defaultConfig: CarouselConfig = {
  loop: false,
  perPage: 1,
  color: '#fff',
  duration: 800,
  cacheSize: 20,
  animated: true,
  gestures: true,
  autoPlay: false,
  playSpeed: 3000,
  panSensitivity: 25,
  mode: CAROUSEL_MODE.Strict
};

@Directive()
export class Carousel implements AfterViewInit, OnChanges, OnDestroy {
  /** Carousel ref */
  carouselRef = new CarouselRef();

  /** Carousel activator */
  // select$: Observable<number> = this.carouselRef.activeChanged.pipe(
  //   map((state: CarouselState) => state.activePage),
  // );

  /** Default config */
  private defaultConfig: CarouselConfig = { ...defaultConfig, ...this._defaultConfig };

  @Input() items: CarouselItem[];
  @Input() loop: boolean = this.defaultConfig.loop;
  @Input() color: string = this.defaultConfig.color;
  @Input() perPage: number = this.defaultConfig.perPage;
  @Input() mode: CarouselMode = this.defaultConfig.mode;
  @Input() duration: number = this.defaultConfig.duration;
  @Input() animated: boolean = this.defaultConfig.animated;
  @Input() gestures: boolean = this.defaultConfig.gestures;
  @Input() autoPlay: boolean = this.defaultConfig.autoPlay;
  @Input() cacheSize: number = this.defaultConfig.cacheSize;
  @Input() playSpeed: number = this.defaultConfig.playSpeed;
  @Input() playReverse: boolean = this.defaultConfig.playReverse;
  @Input() panSensitivity: number = this.defaultConfig.panSensitivity;
  @Output() indexChange = new EventEmitter();

  @Input('select') set select(index: number) {
    console.log('select: ', index);
    this.carouselRef.nextPage();
  }

  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();

  /** Carousel items reference */
  @ContentChildren(CarouselItemDirective) contentItems: QueryList<CarouselItem>;

  private _layoutState = new BehaviorSubject<CarouselLayout>({});

  get layout(): Observable<CarouselLayout> {
    return this._layoutState.asObservable();
  }

  /** Update carousel layout based on child components options */
  setLayout(layout: CarouselLayout) {
    const classes = { ...this._layoutState.value.classes, ...layout.classes };
    const state = { ...layout, ...{ classes } };
    this._layoutState.next({ ...this._layoutState.value, ...state });
  }

  constructor(private _defaultConfig: CarouselConfig) {
  }

  ngAfterViewInit() {
    this.carouselRef.configure({
      loop: this.loop,
      perPage: this.perPage,
      playSpeed: this.playSpeed,
      playReverse: this.playReverse,
    });
    // Load carousel items
    // console.log('load items');
    // this.carouselRef.load(this.items || this.contentItems?.toArray());
    if (this.autoPlay) {
      this.carouselRef.play();
    }


    // this.carouselRef.state.subscribe(x => console.log('carousel state:', x));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items.currentValue && changes.items.currentValue !== changes.items.previousValue) {
      if(changes.items.currentValue.length) {
        console.log('[carousel] on changes', this.items);
        this.carouselRef.load(this.items || this.contentItems?.toArray());
      }
    }
  }

  ngOnDestroy() {
    // this.resetOnResizeActivator.unsubscribe();
    this.carouselRef.destroy();
  }

  /**
   * Go to page by index
   */
  setPage(index: number) {
    this.carouselRef.setPage(index);
  }

  /**
   * Go to item by index
   */
  setItem(index: number) {
    this.carouselRef.setItem(index);
  }

  /**
   * Go to next page
   */
  nextPage() {
    console.log('nextPAge');
    this.carouselRef.nextPage();
  }

  /**
   * Go to prev page
   */
  prevPage() {
    this.carouselRef.prevPage();
  }

  /**
   * Go to next item
   */
  nextItem() {
    this.carouselRef.nextItem();
  }

  /**
   * Go to prev item
   */
  prevItem() {
    this.carouselRef.prevItem();
  }

  /**
   * Play
   */
  play(speed?: number) {
    this.carouselRef.play(speed);
  }

  /**
   * Stop
   */
  stop() {
    this.carouselRef.stop();
  }

}
