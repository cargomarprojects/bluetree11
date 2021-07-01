
import { Component, Injectable, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/core/services/global.service';


//  This Service handles how the date is represented in scripts i.e. ngModel.
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

    readonly DELIMITER = '-';

    fromModel(value: string | null): NgbDateStruct | null {
        if (value) {
            let date = value.split(this.DELIMITER);
            let mdt =  {
                year: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                day: parseInt(date[2], 10),
            };
            //console.log('from model ',mdt);
            return mdt;
        }
        return null;
    }

    toModel(date: NgbDateStruct | null): string | null {
        let mdt= date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
        //console.log('to model ',mdt);
        return mdt;
    }
}

// This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

    readonly DELIMITER = '-';



    constructor(
        private gs: GlobalService
    ) {
        super();
    }


    parse(value: string): NgbDateStruct | null {
        if (value) {
            let date = value.split(this.DELIMITER);
            if (this.gs.DateFormat() == 'dd') {
                let mdt =  {
                    day: parseInt(date[0], 10),
                    month: parseInt(date[1], 10),
                    year: parseInt(date[2], 10),
                };
                //console.log('parse dd ',mdt);
                return mdt;
            }
            if (this.gs.DateFormat() == 'mm') {
                let mdt= {
                    month: parseInt(date[0], 10),
                    day: parseInt(date[1], 10),
                    year: parseInt(date[2], 10),
                };
                //console.log('parse mm ',mdt);
                return mdt;
            }
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        if (this.gs.DateFormat() == 'dd'){
            let mdt = date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
            //console.log('format dd',mdt);
            return mdt;
        }
        if (this.gs.DateFormat() == 'mm'){
            let mdt = date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
            //console.log('format mm ',mdt);
            return mdt;
        }
    }
}


@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
    changeDetection :ChangeDetectionStrategy.OnPush ,
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
    ]
})

export class DateComponent {

    @Input() public colName: string;

    //@Input() public inputdate: string;

    public _inputdate : string ;
    @Input() set inputdate(value: string) {
        //console.log('col name', this.colName, "iputdate", value);
        this._inputdate = value;
    }

    @Output() ValueChanged = new EventEmitter<string>();
    

    @Input() disabled: boolean = false;

    @ViewChild('inputbox') private inputbox: ElementRef;

    localdateFormat = 'dd-mm-yyyy';

    yy: number;
    mm: number;
    dd: number;

    constructor(
        private ngbCalendar: NgbCalendar,
        private dateAdapter: NgbDateAdapter<string>,
        private gs: GlobalService
    ) { 
        if ( this.gs.DateFormat() == 'dd')
            this.localdateFormat = 'dd-mm-yyyy';
        else 
            this.localdateFormat = 'mm-dd-yyyy';
    }

    get today() {
        return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
    }

    ngOnInit() {

    }

    setMyStyles() {
        let styles = {
            'border': '1px solid rgba(0,0,255,0.25)',
            'margin-left': '0px',
            'border-radius': '0px',
        };
        return styles;
    }

    Focus() {
        if (!this.disabled)
            this.inputbox.nativeElement.focus();
    }


    OnBlur1() {
    
        //console.log('Blur1');
        if (this.isValidDate()) {

            this._inputdate = this.yy + "-" + this.mm + "-" + this.dd;
            this.ValueChanged.emit(this._inputdate);
            
            return true;
        }
        else {
            this._inputdate = '';
            this.ValueChanged.emit(this._inputdate);
            
            return false;
        }
    
    }

    ngAfterViewInit() {

        //if (!this.gs.isBlank(this._inputdate))
          //this.inputbox.nativeElement.focus();
    
      }

    OnBlur2() {
    
    }

    dateSelected(){
        //console.log( 'Date Selected ', this._inputdate);
        this.OnBlur1();
    }


    isValidDate() {

        var date1 = new Date();

        this.yy = 0;
        this.mm = 0;
        this.dd = 0;

        // Parse the date parts to integers

        if (this._inputdate == null || this._inputdate == undefined)
            this._inputdate = "";

        if (this._inputdate.indexOf("/") != -1) {
            var parts = this._inputdate.split("/");
            if (parts.length == 3) {
                this.yy = parseInt(parts[0], 10);
                this.mm = parseInt(parts[1], 10);
                this.dd = parseInt(parts[2], 10);
            }
        }
        else if (this._inputdate.indexOf("-") != -1) {
            var parts = this._inputdate.split("-");
            if (parts.length == 3) {
                this.yy = parseInt(parts[0], 10);
                this.mm = parseInt(parts[1], 10);
                this.dd = parseInt(parts[2], 10);
            }
        }
        else {
            if (this._inputdate.length == 8) {
                if (this.gs.DateFormat() == 'dd') {
                    this.dd = parseInt(this._inputdate.substr(0, 2));
                    this.mm = parseInt(this._inputdate.substr(2, 2));
                    this.yy = parseInt(this._inputdate.substr(4, 4));
                }
                else if (this.gs.DateFormat() == 'mm') {
                    this.mm = parseInt(this._inputdate.substr(0, 2));
                    this.dd = parseInt(this._inputdate.substr(2, 2));
                    this.yy = parseInt(this._inputdate.substr(4, 4));
                }
            }
            if (this._inputdate.length == 6) {
                if (this.gs.DateFormat() == 'dd') {
                    this.dd = parseInt(this._inputdate.substr(0, 2));
                    this.mm = parseInt(this._inputdate.substr(2, 2));
                    this.yy = parseInt(this._inputdate.substr(4, 2));
                    this.yy += 2000;
                }
                else if (this.gs.DateFormat() == 'mm') {
                    this.mm = parseInt(this._inputdate.substr(0, 2));
                    this.dd = parseInt(this._inputdate.substr(2, 2));
                    this.yy = parseInt(this._inputdate.substr(4, 2));
                    this.yy += 2000;
                }

            }
            else if (this._inputdate.length == 4) {
                if (this.gs.DateFormat() == 'dd') {
                    this.dd = parseInt(this._inputdate.substr(0, 2));
                    this.mm = parseInt(this._inputdate.substr(2, 2));
                    this.yy = date1.getFullYear();
                }
                else if (this.gs.DateFormat() == 'mm') {
                    this.mm = parseInt(this._inputdate.substr(0, 2));
                    this.dd = parseInt(this._inputdate.substr(2, 2));
                    this.yy = date1.getFullYear();
                }
            }
            else if (this._inputdate.length == 1 || this._inputdate.length == 2) {
                if (this.gs.DateFormat() == 'dd') {
                    this.dd = parseInt(this._inputdate);
                    this.mm = date1.getMonth() + 1;
                    this.yy = date1.getFullYear();
                }
                else if (this.gs.DateFormat() == 'mm') {
                    this.mm = parseInt(this._inputdate);
                    this.dd = date1.getDate();
                    this.yy = date1.getFullYear();
                }
            }
        }

        // Check the ranges of month and year
        if (this.yy < 1000 || this.yy > 3000 || this.mm < 1 || this.mm > 12) {
            return false;
        }
        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (this.yy % 400 == 0 || (this.yy % 100 != 0 && this.yy % 4 == 0)) {
            monthLength[1] = 29;
        }

        // Check the range of the day
        if (this.dd > 0 && this.dd <= monthLength[this.mm - 1]) {
            return true;
        }
        else {
            return false;
        }
    }




}


