import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy
}                       from "@angular/core";
import {
  animate,
  style,
  transition,
  trigger
}                       from "@angular/animations";
import { Subscription } from "rxjs";

@Component({
  selector: 'gallery-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease-in', style({opacity: 1}))
      ])
    ])
  ],
  template: `
    <div *ngIf="isError"
         class="g-image-error-message">
      <h2>⚠</h2>
      <p>Unable to load the video!</p>
    </div>
    <video *ngIf="!isError" #video [controls]="controls" [poster]="poster" (error)="error.emit($event)">
      <source *ngFor="let src of videoSources;let last = last" [src]="src?.url" [type]="src?.type" (error)="last ? error.emit($event) : null"/>
    </video>
  `
})
export class GalleryVideoComponent implements OnInit, OnDestroy {

  videoSources: { url: string, type?: string }[];
  controls: boolean;

  @Input() src: string | { url: string, type?: string }[];
  @Input() poster: string;
  @Input('controls') controlsEnabled: boolean;

  @Input('pause') set pauseVideo(shouldPause: boolean) {
    if (this.video.nativeElement) {
      const video: HTMLVideoElement = this.video.nativeElement;
      if (shouldPause && !video.paused) {
        video.pause();
      }
    }
  }

  @Input('play') set playVideo(shouldPlay: boolean) {
    if (this.video.nativeElement) {
      const video: HTMLVideoElement = this.video.nativeElement;
      if (shouldPlay) {
        video.play();
      }
    }
  }

  /** Stream that emits when an error occurs */
  @Output() error = new EventEmitter<Error>();

  @ViewChild('video', { static: true }) video: ElementRef;

  public isError = false;

  private isErrorSub: Subscription = null;

  ngOnInit() {
    if (this.src instanceof Array) {
      // If video has multiple sources
      this.videoSources = [...this.src];
    } else {
      this.videoSources = [{ url: this.src }];
    }
    this.controls = typeof this.controlsEnabled === 'boolean' ? this.controlsEnabled : true;

    this.isErrorSub = this.error
                          .subscribe(error => {
      this.isError = true;
    });
  }

  ngOnDestroy(): void {
    if (this.isErrorSub) {
      this.isErrorSub.unsubscribe();
    }
  }
}
