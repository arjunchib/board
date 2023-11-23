import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    '(document:mousedown)': 'onDown($event)',
    '(document:mouseup)': 'onUp($event)',
  },
})
export class HomeComponent {
  title = 'Ollie Board';
  lineWidth = 5;

  @ViewChild('canvas') private canvasChild!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private penDown = false;

  constructor() {
    afterNextRender(() => {
      const context = this.canvas.getContext('2d');
      if (!context) throw new Error('No canvas context');
      this.ctx = context;
      this.ctx.fillStyle = 'black';
      this.fixHighRes();
      this.setLineWidth();
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
    this.canvas.style.height = `${rect.height}px`;
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

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setLineWidth() {
    this.ctx.lineWidth = this.lineWidth;
  }
}
