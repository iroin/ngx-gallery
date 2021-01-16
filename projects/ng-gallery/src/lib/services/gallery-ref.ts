import { BehaviorSubject, Observable, Subscription, SubscriptionLike, of, EMPTY } from 'rxjs';
import { delay, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { CarouselItem } from '../carousel/carousel.model';
import { GalleryState } from '../models/gallery.model';

interface CarouselIndex {
  page: number;
  item: number;
}

interface CarouselOptions {
  loop?: boolean;
  perPage?: number;
  playSpeed?: number;
  playReverse?: boolean;
}

/** Initial state */
const defaultState: GalleryState = {
  play: false,
  activeItem: 0,
  activePage: 0,
  hasNextItem: false,
  hasPrevItem: false,
  pages: [],
  total: 0
};

const playChangedPipe = distinctUntilChanged((curr: GalleryState, prev: GalleryState) => curr.play === prev.play);
const itemChangedPipe = distinctUntilChanged((curr: GalleryState, prev: GalleryState) => curr.activeItem === prev.activeItem);
const pageChangedPipe = distinctUntilChanged((curr: GalleryState, prev: GalleryState) => curr.activePage === prev.activePage);
const loadChangedPipe = distinctUntilChanged((curr: GalleryState, prev: GalleryState) => curr.pages === prev.pages);

export class GalleryRef {

  /** Index that stores groups and items keys */
  private readonly _index = new Map<number, CarouselIndex>();

  /** Subscription for carousel player */
  private readonly _player: SubscriptionLike = Subscription.EMPTY;

  /** Stream that emits carousel state */
  private readonly _state = new BehaviorSubject<GalleryState>(defaultState);
  readonly state$ = this._state.asObservable();

  /** Stream that emits when the player should start or stop */
  get playChanged(): Observable<GalleryState> {
    return this.state$.pipe(playChangedPipe);
  }

  /** Stream that emits when items is loaded */
  get loadChanged(): Observable<GalleryState> {
    return this.state$.pipe(loadChangedPipe);
  }

  /** Stream that emits when active changed */
  get activeChanged(): Observable<GalleryState> {
    return this.state$.pipe(pageChangedPipe);
  }

  /** Get the current state of the carousel state stream */
  get snapshot(): GalleryState {
    return this._state.value;
  }

  constructor() {
    this._player = this._activatePlayer();
  }

  /**
   * Configure carousel
   * @param config Carousel config
   */
  configure(config: CarouselOptions) {
    this._patchState({
      loop: config.loop,
      perPage: config.perPage,
      playSpeed: config.playSpeed,
      playReverse: config.playReverse
    });
    this.reload();
  }

  /**
   * Reload the same items with the recent config
   */
  reload() {
    this.load(this.snapshot.pages);
  }

  /**
   * Load carousel items
   */
  load(items: CarouselItem[]) {
    // Initialize carousel items
    this._patchState({
      pages: items,
      total: items.length,
      activeItem: 0,
      activePage: 0,
      hasNextItem: items.length > 1,
      hasPrevItem: false
    });
  }

  /**
   * Set active item
   */
  set(activeItem: number) {
    console.log('SETPAGE', activeItem);
    const { page } = this._index.get(activeItem);
    this._patchState({
      activeItem,
      activePage: page,
      hasNextItem: this.snapshot.loop || activeItem < this.snapshot.total - 1,
      hasPrevItem: this.snapshot.loop || activeItem > 0
    });
  }

  /**
   * Next item
   */
  next() {
    console.log('SETPAGE', 'next');
    if (this.snapshot.hasNextItem) {
      this.set(this.snapshot.activeItem + 1);
    } else if (this.snapshot.loop) {
      this.set(0);
    }
  }

  /**
   * Prev item
   */
  prev() {
    if (this.snapshot.hasPrevItem) {
      this.set(this.snapshot.activeItem - 1);
    } else if (this.snapshot.loop) {
      this.set(this.snapshot.total - 1);
    }
  }

  /**
   * Start carousel player
   */
  play(speed = this.snapshot.playSpeed) {
    this._patchState({ play: true, playSpeed: speed });
  }

  /**
   * Stop carousel player
   */
  stop() {
    this._patchState({ play: false });
  }

  /**
   * Reset carousel state
   */
  reset() {
    this._patchState(defaultState);
  }

  /**
   * Destroy carousel
   */
  destroy() {
    this._player.unsubscribe();
    this._state.complete();
  }

  /**
   * Patch state
   */
  private _patchState(state: GalleryState) {
    this._state.next({ ...this.snapshot, ...state });
  }

  /**
   * Activate player actions listener
   */
  private _activatePlayer(): Subscription {
    return this.state$.pipe(
      switchMap((state: GalleryState) =>
        state.play ? of({}).pipe(
          delay(this.snapshot.playSpeed),
          tap(() => {
            this.snapshot.playReverse
              ? this.snapshot.hasPrevItem ? this.prev() : this.set(this.snapshot.pages.length - 1)
              : this.snapshot.hasNextItem ? this.next() : this.set(0);
          })
        ) : EMPTY
      )
    ).subscribe();
  }
}
