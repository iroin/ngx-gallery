import {
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  NgZone,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  Directive,
  OnChanges, SimpleChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CarouselState } from '../carousel.model';
import { CarouselRef } from '../carousel-ref';

declare let Hammer: any;

@Directive()
export class SliderBase implements OnInit, OnChanges, OnDestroy {

  @Input() duration: number;
  @Input() gestures: boolean;
  @Input() animated: boolean;
  @Input() panSensitivity: number;
  // @Input() easeFunc: SmoothScrollEaseFunc;
  @Input() state: CarouselState;

  // @Input() state: CarouselState;

  @Input() size: number | 'full' | 'auto';

  // @Input() set select(index: number) {
  //   console.log('select', index)carouselRef
  // }

  @Input() carouselRef: CarouselRef;

  @Output() next = new EventEmitter();
  @Output() prev = new EventEmitter();

  /** Virtual scroll viewport reference */
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  get itemWidth(): number {
    return this._el.nativeElement.clientWidth;
  }

  get itemHeight(): number {
    return this._el.nativeElement.clientHeight;
  }

  get itemSize(): number {
    return undefined;
  }

  /** HammerJS instance */
  protected _hammer: any;

  /** The offset value on pan start */
  protected _panOffset = 0;

  /** View resize subscription */
  private _resetOnResize = Subscription.EMPTY;

  constructor(protected _el: ElementRef,
              protected _zone: NgZone,
              private _cd: ChangeDetectorRef,
              // private _document: Document,
              private _platform: any) {
    Hammer = (document.defaultView as any).Hammer;
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platform)) {
      this._zone.runOutsideAngular(() => {
        if (this.gestures && Hammer) {
          this._hammer = new Hammer(this._el.nativeElement);
          this._activateGestures();
        }

        // this._resetOnResize = fromEvent(this._document.defaultView, 'resize').pipe(
        //   debounceTime(200),
        //   tap(() => this._cd.detectChanges()),
        //   tap(() => this.viewPort.scrollToIndex(this.state.activePage)),
        // ).subscribe();

        // Update carousel layout when the view is re-sized
        // this._resetOnResize = fromEvent(this._document.defaultView, 'resize').pipe(
        //   debounceTime(200),
        //   tap(() => this._cd.detectChanges()),
        //   tap(() => this.viewPort.scrollToIndex(this.state.activePage)),
        // ).subscribe();
      });
    }
  }

  ngOnChanges(changes:SimpleChanges) {
    console.log('[slider] onChanges', this.state);
    if (changes.carouselRef && changes.carouselRef.firstChange && this.carouselRef) {
      console.log('yes');
      this.carouselRef.state$.subscribe((x) => {
        console.log('scrollto index', this.viewPort, x.activePage);
        this.viewPort?.scrollToIndex(x.activePage, 'smooth');
      });
    }
  }

  ngOnDestroy() {
    this._resetOnResize.unsubscribe();
  }

  /**
   * Pan end handler
   */
  // protected _panEnd(velocity: number, delta: number) {
  //   this._zone.run(() => {
  //     if (velocity > 0.3) {
  //       this.prev.emit();
  //     } else if (velocity < -0.3) {
  //       this.next.emit();
  //     } else {
  //       if (delta / 2 <= -this.itemSize * this.state.pages.length / this.panSensitivity) {
  //         this.next.emit();
  //       } else if (delta / 2 >= this.itemSize * this.state.pages.length / this.panSensitivity) {
  //         this.prev.emit();
  //       } else {
  //         this.select = this.state.activePage;
  //       }
  //     }
  //   });
  // }
  protected _panEnd(velocity: number, delta: number) {
    this._zone.run(() => {
      if (velocity > 0.3) {
        this.prev.emit();
      } else if (velocity < -0.3) {
        this.next.emit();
      } else {
        if (delta / 2 <= -this.itemSize * this.state.pages.length / this.panSensitivity) {
          this.next.emit();
        } else if (delta / 2 >= this.itemSize * this.state.pages.length / this.panSensitivity) {
          this.prev.emit();
        } else {
          // this.select = this.state.activePage;
          this.carouselRef.setPage(this.state.activePage);
        }
      }
    });
  }

  /**
   * Activate gestures
   */
  protected _activateGestures() {
  }
}
