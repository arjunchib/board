import { Component, HostBinding, OnInit, inject, signal } from '@angular/core';
import { Image, ImageService } from '../services/image/image.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixArrowLeft, radixArrowRight } from '@ng-icons/radix-icons';
import { AsyncPipe } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [NgIconComponent, AsyncPipe],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
  providers: [
    provideIcons({
      radixArrowLeft,
      radixArrowRight,
    }),
  ],
  animations: [
    trigger('enterLeave', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(100),
      ]),
      transition(':leave', [
        animate(100, style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class ImageGalleryComponent implements OnInit {
  imageService = inject(ImageService);
  images = signal([] as Image[]);
  pending = true;

  @HostBinding('@enterLeave') slideIn = 'void';

  async ngOnInit() {
    this.imageService.init().subscribe((images) => {
      this.images.set(images);
      this.pending = false;
    });
  }

  next() {
    this.pending = true;
    this.imageService.next().subscribe((images) => {
      this.images.set(images);
      this.pending = false;
    });
  }

  prev() {
    const prevImages = this.imageService.prev();
    if (prevImages) this.images.set(prevImages);
  }

  imageSrc(key: string) {
    return `/image/${key}`;
  }
}
