import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges , HostListener} from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';


@Component({
    selector: 'InputBox',
    templateUrl: './inputbox.component.html'
})


export class InputBoxComponent {

    @Input() inputModel: string;
    @Output() inputModelChange = new EventEmitter<string>();
    @Input() disabled: boolean = false;
    @Input() maxlength: number = 1;

    @Input() uppercase: boolean = false;
    @Input() lowercase: boolean = false;

    @Input() whitespace: boolean = true;


    @Input() field: string;
    @Input() rec: any;
    @Output() blur = new EventEmitter<{field : string , rec : any}>();

    @ViewChild('inputbox') private inputbox: ElementRef;

    constructor(private gs: GlobalService) {
    }

    ngOnInit() {

    }

    onBlur1($event) {
        if (this.inputModel != null) {
            this.inputModel = this.inputModel.trim();
            if (this.uppercase) {
                this.inputModel = this.inputModel.toUpperCase();

            }
            else if (this.lowercase) {
                this.inputModel = this.inputModel.toLowerCase();
            }
            if ( !this.whitespace)
                this.inputModel = this.gs.RemoveWhiteSpace(this.inputModel);
        }
        this.inputModelChange.emit(this.inputModel);        
        if ( this.blur)
        {
            this.blur.emit({ field: this.field,rec: this.rec});        
        }
    }

    public focus() {
        if (!this.disabled)
          this.inputbox.nativeElement.focus();
      }


      onDrop(event) {
        if (this.inputModel == null) 
            return;
        var _case = "";
        let data = event.dataTransfer.getData('data');
        if ( !this.whitespace)
            data = this.gs.RemoveWhiteSpace(data, "");
        if ( this.uppercase)
            data = data.toUpperCase();
        if ( this.lowercase)
            data = data.toLoserCase();            

        this.inputModel = data;
        event.preventDefault();
        event.target.style.background = null;
      }
      
      allowDrop(event) {
        event.preventDefault();
        event.target.style.background = "orange";
      } 

      onDragLeave(event) {
        event.preventDefault();
        event.target.style.background = null;
      }



}
