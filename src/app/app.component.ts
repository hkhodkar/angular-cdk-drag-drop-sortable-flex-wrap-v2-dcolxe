import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;

  public items: Array<number> = [1];

  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

  add() {
    this.items.push(this.items.length + 1);
  }

  shuffle() {
    this.items.sort(function () {
      return 0.5 - Math.random();
    });
  }

  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };
    console.log('dragEntered', { dragIndex, dropIndex });

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');

    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);

      moveItemInArray(this.items, dragIndex, dropIndex);
    }
  }

  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;

    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        '.cdk-drag-placeholder'
      );

    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement?.nextElementSibling
        : placeholderElement?.previousElementSibling;

    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }

  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
}
