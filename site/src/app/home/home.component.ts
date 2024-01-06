import {
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  NgIconComponent,
  provideIcons,
  provideNgIconsConfig,
} from '@ng-icons/core';
import {
  radixTrash,
  radixEraser,
  radixUpload,
  radixPencil1,
  radixUpdate,
} from '@ng-icons/radix-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [
    provideIcons({
      radixTrash,
      radixEraser,
      radixUpload,
      radixPencil1,
      radixUpdate,
    }),
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    '(document:mouseup)': 'onUp($event)',
    '(document:touchend)': 'onTouchEnd($event)',
  },
})
export class HomeComponent {
  title = 'Ollie Board';
  mode: 'pencil' | 'eraser' = 'pencil';
  lineWidth = 5;
  uploadDisabled = false;

  @ViewChild('canvas') private canvasChild!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private penDown = false;
  private http = inject(HttpClient);
  private zone = inject(NgZone);

  constructor() {
    afterNextRender(() => {
      const context = this.canvas.getContext('2d');
      if (!context) throw new Error('No canvas context');
      this.ctx = context;
      this.ctx.fillStyle = 'black';
      this.fixHighRes();
      this.setLineWidth();
      this.clear();
    });
  }

  private get canvas() {
    return this.canvasChild.nativeElement;
  }

  private fixHighRes() {
    const dpr = window.devicePixelRatio;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${rect.width}px`;
    // this.canvas.style.height = `${rect.height}px`;
  }

  onMove(e: MouseEvent) {
    if (this.penDown) {
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
    }
  }

  onDown(e: MouseEvent) {
    this.penDown = true;
    this.ctx.beginPath();
    this.ctx.arc(e.offsetX, e.offsetY, this.lineWidth / 2, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  onUp() {
    this.penDown = false;
  }

  onTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    if (this.penDown) {
      const rect = this.canvas.getBoundingClientRect();
      const offsetX = touch.clientX - rect.x;
      const offsetY = touch.clientY - rect.y;
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
    }
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.x;
    const offsetY = touch.clientY - rect.y;
    this.penDown = true;
    this.ctx.beginPath();
    this.ctx.fill();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  onTouchEnd() {
    this.penDown = false;
  }

  clear() {
    const fill = this.ctx.fillStyle;
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = fill;
  }

  enablePencil() {
    this.mode = 'pencil';
  }

  enableEraser() {
    this.mode = 'eraser';
  }

  setLineWidth() {
    this.ctx.lineWidth = this.lineWidth;
  }

  upload() {
    this.uploadDisabled = true;
    this.canvas.toBlob((blob) => {
      this.zone.run(() => {
        this.http
          .post('/upload', blob, {
            headers: { 'Content-Type': 'image/png' },
            responseType: 'text',
          })
          .subscribe(() => {
            this.uploadDisabled = false;
          });
      });
    });
  }
}
