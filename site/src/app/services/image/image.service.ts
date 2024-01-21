import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map, of } from 'rxjs';

interface ImageResponse {
  images: ImageJson[];
  cursor?: string;
  hasMore: boolean;
}

interface ImageJson {
  key: string;
  createdAt: string;
}

export interface Image {
  key: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);
  private cursor?: Date;
  private images: Image[][] = [];
  private hasMore = true;
  private index = signal(-1);
  private initialized = false;
  public hasNext = signal(true);
  public hasPrev = computed(() => this.index() > 0);

  init() {
    if (this.initialized) {
      return of(this.images[this.index()]);
    }
    this.initialized = true;
    return this.next();
  }

  next() {
    if (this.index() < this.images.length - 1) {
      this.hasNext.set(this.hasMore);
      this.index.update((i) => i + 1);
      return of(this.images[this.index()]);
    }
    const params = new URLSearchParams({
      limit: '20',
      cursor: this.cursor?.toISOString() ?? '',
    });
    return this.http.get<ImageResponse>(`images?${params.toString()}`).pipe(
      map((res) => {
        const mappedImgs = res.images.map((img) => ({
          ...img,
          createdAt: new Date(img.createdAt),
        }));
        this.images.push(mappedImgs);
        this.index.update((i) => i + 1);
        this.cursor = res.cursor ? new Date(res.cursor) : undefined;
        this.hasNext.set(res.hasMore);
        this.hasMore = res.hasMore;
        return mappedImgs;
      })
    );
  }

  prev() {
    if (!this.hasPrev) return;
    this.hasNext.set(true);
    this.index.update((i) => i - 1);
    return this.images[this.index()];
  }
}
