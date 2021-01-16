import { BehaviorSubject, Observable, Subscription, SubscriptionLike, of, EMPTY } from 'rxjs';
import { delay, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { CarouselItem, CarousePage, CarouselState } from './carousel.model';

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
const defaultState: CarouselState = {
  play: false,
  activeItem: 0,
  activePage: 0,
  hasNextItem: false,
  hasPrevItem: false,
  hasNextPage: false,
  hasPrevPage: false,
  pages: [],
  total: 0
};

const playChangedPipe = distinctUntilChanged((curr: CarouselState, prev: CarouselState) => curr.play === prev.play);
const itemChangedPipe = distinctUntilChanged((curr: CarouselState, prev: CarouselState) => curr.activeItem === prev.activeItem);
const pageChangedPipe = distinctUntilChanged((curr: CarouselState, prev: CarouselState) => curr.activePage === prev.activePage);
const loadChangedPipe = distinctUntilChanged((curr: CarouselState, prev: CarouselState) => curr.pages === prev.pages);

export class CarouselRef {

  /** Index that stores groups and items keys */
  private readonly _index = new Map<number, CarouselIndex>();

  /** Subscription for carousel player */
  private readonly _player: SubscriptionLike = Subscription.EMPTY;

  /** Stream that emits carousel state */
  private readonly _state = new BehaviorSubject<CarouselState>(defaultState);
  readonly state$ = this._state.asObservable();

  /** Stream that emits when the player should start or stop */
  get playChanged(): Observable<CarouselState> {
    return this.state$.pipe(playChangedPipe);
  }

  /** Stream that emits when items is loaded */
  get loadChanged(): Observable<CarouselState> {
    return this.state$.pipe(loadChangedPipe);
  }

  /** Stream that emits when active changed */
  get activeChanged(): Observable<CarouselState> {
    return this.state$.pipe(pageChangedPipe);
  }

  /** Get the current state of the carousel state stream */
  get snapshot(): CarouselState {
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
    const newItems: CarouselItem[] = this.snapshot.pages
    .map(page => page.items)
    .reduce((total, items) => [...total, ...items], []);
    this.load(newItems);
  }

  /**
   * Load carousel items
   * @param items Carousel items array
   */
  load(items: CarouselItem[]) {
    console.log('load', items);
    const pages: CarousePage[] = [];
    const perPage = this.snapshot.perPage;
    const extra = items.length % perPage;
    const pagesCount = Math.floor(extra ? (items.length / perPage) + extra : items.length / perPage);

    Array.from(Array(pagesCount).keys()).map((i: number) => {
      const newItems: CarouselItem[] = [];
      const itemsPart = items.slice(i * perPage, (i * perPage) + perPage);

      itemsPart.forEach((item: CarouselItem, j: number) => {
        const page = (i * perPage) + j;
        newItems.push({index: page, template: item.template});
        this._index.set(page, {page: i, item: j});
      });

      pages.push({index: i, items: newItems});
    });

    // Initialize carousel items
    this._patchState({
      pages,
      total: items.length,
      activeItem: 0,
      activePage: 0,
      hasNextItem: items.length > 1,
      hasNextPage: pages.length > 1,
      hasPrevPage: false,
      hasPrevItem: false
    });
  }

  /**
   * Set active item
   * @param activeItem Item index
   */
  setItem(activeItem: number) {
    const {page} = this._index.get(activeItem);
    this._patchState({
      activeItem,
      activePage: page,
      hasNextItem: this.snapshot.loop || activeItem < this.snapshot.total - 1,
      hasNextPage: this.snapshot.loop || page < this.snapshot.pages.length - 1,
      hasPrevItem: this.snapshot.loop || activeItem > 0,
      hasPrevPage: this.snapshot.loop || page > 0,
    });
  }

  /**
   * Set active page
   * @param activePage Page index
   */
  setPage(activePage: number) {
    const item = this.snapshot.pages[activePage].items[0].index;
    this._patchState({
      activePage,
      activeItem: item,
      hasNextItem: this.snapshot.loop || item < this.snapshot.total - 1,
      hasNextPage: this.snapshot.loop || activePage < this.snapshot.pages.length - 1,
      hasPrevItem: this.snapshot.loop || item > 0,
      hasPrevPage: this.snapshot.loop || activePage > 0,
    });
  }

  /**
   * Next item
   */
  nextItem() {
    if (this.snapshot.hasNextItem) {
      this.setItem(this.snapshot.activeItem + 1);
    } else if (this.snapshot.loop) {
      this.setItem(0);
    }
  }

  /**
   * Prev item
   */
  prevItem() {
    if (this.snapshot.hasPrevItem) {
      this.setItem(this.snapshot.activeItem - 1);
    } else if (this.snapshot.loop) {
      this.setItem(this.snapshot.total - 1);
    }
  }

  /**
   * Prev page
   */
  nextPage() {
    console.log('nextPage');
    if (this.snapshot.hasNextPage) {
      this.setPage(this.snapshot.activePage + 1);
    } else if (this.snapshot.loop) {
      this.setPage(0);
    }
  }

  /**
   * Prev page
   */
  prevPage() {
    console.log('prevPage');
    if (this.snapshot.hasPrevPage) {
      this.setPage(this.snapshot.activePage - 1);
    } else if (this.snapshot.loop) {
      this.setPage(this.snapshot.pages.length - 1);
    }
  }

  /**
   * Start carousel player
   * @param speed Player speed in ms
   */
  play(speed = this.snapshot.playSpeed) {
    this._patchState({play: true, playSpeed: speed});
  }

  /**
   * Stop carousel player
   */
  stop() {
    this._patchState({play: false});
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
   * @param state Carousel state
   */
  private _patchState(state: CarouselState) {
    this._state.next({...this.snapshot, ...state});
  }

  /**
   * Activate player actions listener
   */
  private _activatePlayer(): Subscription {
    return this.state$.pipe(
      switchMap((state: CarouselState) =>
        state.play ? of({}).pipe(
          delay(this.snapshot.playSpeed),
          tap(() => {
            this.snapshot.playReverse
              ? this.snapshot.hasPrevPage ? this.prevPage() : this.setPage(this.snapshot.pages.length - 1)
              : this.snapshot.hasNextPage ? this.nextPage() : this.setPage(0);
          })
        ) : EMPTY
      )
    ).subscribe();
  }
}
