import { Component, HostListener, inject } from '@angular/core';
import { ModalService } from '../services/modal/modal.service';
import { NgComponentOutlet } from '@angular/common';
import {
  animate,
  animateChild,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { radixCross2 } from '@ng-icons/radix-icons';

@Component({
  selector: 'app-modal-outlet',
  standalone: true,
  imports: [NgComponentOutlet, NgIconComponent],
  templateUrl: './modal-outlet.component.html',
  styleUrl: './modal-outlet.component.css',
  providers: [provideIcons({ radixCross2 })],
  animations: [
    trigger('modal', [
      transition('* <=> *', [
        query('@panel', animateChild()),
        query('@backdrop', animateChild()),
      ]),
    ]),
    trigger('panel', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.975)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate(
          '100ms ease-in',
          style({ opacity: 0, transform: 'scale(0.975)' })
        ),
      ]),
    ]),
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 0.2 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ModalOutletComponent {
  public modalService = inject(ModalService);

  @HostListener('window:keydown.esc') close() {
    this.modalService.close();
  }
}
