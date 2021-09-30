import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'App-Dscreen',
  templateUrl: './dscreen.component.html'
})
export class DscreenComponent implements OnInit {

  @Input() id: any;
  @Output() result: EventEmitter<string> = new EventEmitter<string>();

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() { }
  
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      if (propName == 'visible') {

      }
    }
  }
  
  open(content : any) {
    this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false, windowClass :'modal-custom' }).result.then((result) => {
      if (result == 'Y') {
        this.result.emit('');
      }
      else {
        this.result.emit('');
      }
    }, (reason) => {
      {
        this.result.emit('');
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}
