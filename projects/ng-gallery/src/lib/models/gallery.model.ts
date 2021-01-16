import { CarouselItem } from '../carousel/carousel.model';

export interface GalleryState {
  loop?: boolean;
  total?: number;
  play?: boolean;
  perPage?: number;
  playSpeed?: number;
  playReverse?: boolean;
  hasNextItem?: boolean;
  hasPrevItem?: boolean;
  activeItem?: number;
  activePage?: number;
  pages?: CarouselItem[];
}

export interface GalleryItem {
  data?: any;
  type?: string;
}

export interface GalleryError {
  itemIndex: number;
  error: Error;
}
