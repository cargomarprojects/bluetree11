
import { Component, HostBinding } from '@angular/core';


@Component({
  selector: '[resizable]th',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.css']
  
})
export class ResizableComponent {
  constructor() {}
  @HostBinding('style.width.px')
  width: number | null = null;

  onResize(width: any) {
    this.width = width;
  }
}