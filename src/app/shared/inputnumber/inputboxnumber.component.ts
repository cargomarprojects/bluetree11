import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges , HostListener} from '@angular/core';
import { GlobalService } from '../../core/services/global.service';

@Component({
    selector: 'InputBoxNumber',
    templateUrl: './inputboxnumber.component.html'
})

export class InputBoxNumberComponent {

    @Input() inputModel: number;
    @Output() inputModelChange = new EventEmitter<number>();
    @Input() disabled: boolean = false;
    @Input() maxlength: number = 25;
    @Input() dec: number = 2;
    @Input() field: string;
    @Input() rec: any;
    @Output() blur = new EventEmitter<{field : string , rec : any}>();

    @ViewChild('inputbox') private inputbox: ElementRef;

    constructor(public gs: GlobalService,
    ) {
    }

    ngOnInit() {

    }

    onBlur1($event) {
        if (this.inputModel != null) {
            this.inputModel = this.gs.roundNumber(this.inputModel, this.dec);            
        }
        this.inputModelChange.emit(this.inputModel);        
        if ( this.blur)
            this.blur.emit({ field: this.field,rec: this.rec});        

    }

    public focus() {
        if (!this.disabled)
          this.inputbox.nativeElement.focus();
      }
}
