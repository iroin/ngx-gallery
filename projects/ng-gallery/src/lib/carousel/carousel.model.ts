import { InjectionToken, TemplateRef } from '@angular/core';

export interface CarouselConfig {
  color?: string;
  mode?: CarouselMode;
  loop?: boolean;
  perPage?: number;
  playSpeed?: number;
  playReverse?: boolean;
  gestures?: boolean;
  animated?: boolean;
  orientation?: CarouselOrientation;
  autoPlay?: boolean;
  panSensitivity?: number;
  cacheSize?: number;
  duration?: number;
}

export const CAROUSEL_CONFIG = new InjectionToken<CarouselConfig>('CAROUSEL_CONFIG');

export enum CAROUSEL_ORIENTATION {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

export enum CAROUSEL_MODE {
  Free = 'free',
  Strict = 'strict'
}

/** The state of each step. */
export type CarouselOrientation = CAROUSEL_ORIENTATION.Horizontal | CAROUSEL_ORIENTATION.Vertical;
export type CarouselMode = CAROUSEL_MODE.Strict | CAROUSEL_MODE.Free;

export interface CarouselState {
  loop?: boolean;
  total?: number;
  play?: boolean;
  perPage?: number;
  playSpeed?: number;
  playReverse?: boolean;
  hasNextItem?: boolean;
  hasPrevItem?: boolean;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  activeItem?: number;
  activePage?: number;
  pages?: CarousePage[];
}

/** Carousel item */
export interface CarouselItem {
  index: number;
  template: TemplateRef<any>;
}

/** Carousel page */
export interface CarousePage {
  index: number;
  items: CarouselItem[];
}
