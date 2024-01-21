import { Component, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public dialog?: any;
  public visible = false;

  open(dialog: any) {
    this.dialog = dialog;
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}
