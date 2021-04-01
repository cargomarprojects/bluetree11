
import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, OnChanges, SimpleChange, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SearchTable } from '../models/searchtable';
import { LoginService } from '../../core/services/login.service';
import { GlobalService } from '../../core/services/global.service';


@Component({
  selector: 'app-autocomplete2',
  templateUrl: './autocomplete2.component.html',
  styleUrls: ['./autocomplete2.component.css']
})

export class AutoComplete2Component {

  //@ViewChild('_cbtn') cbtn_field: ElementRef;
  //@ViewChildren('_itms') itms_field: QueryList<ElementRef>;

  @Output() ValueChanged = new EventEmitter<SearchTable>();
  @Input() disabled: boolean = false;

  @ViewChild('inputbox') private inputbox: ElementRef;
  @ViewChild("lov") private lov: ElementRef;
  @ViewChildren('lov') inputs: QueryList<ElementRef>;


  private _controlname: string;
  @Input() set controlname(value: string) {
    this._controlname = value;
  }

  private _displaycolumn: string;
  @Input() set displaycolumn(value: string) {
    this._displaycolumn = value;
  }

  private _tabletype: string;
  @Input() set tabletype(value: string) {
    this._tabletype = value;
  }

  private _subtype: string;
  @Input() set subtype(value: string) {
    this._subtype = value;
  }

  private _id: string;
  @Input() set id(value: string) {
    this._id = value;
  }

  public _displaydata: string;
  @Input() set displaydata(value: string) {
    this._displaydata = value;
  }

  private _where: string;
  @Input() set where(value: string) {
    this._where = value;
  }



  private _parentid: string;
  @Input() set parentid(value: string) {
    this._parentid = value;
  }

  private _uid: string;
  @Input() set uid(value: string) {
    this._uid = value;
  }


  private _branchcode: string;
  @Input() set branchcode(value: string) {
    this._branchcode = value;
  }

  private inputdata: SearchTable = new SearchTable();

  

  

  focuselement: number = 0;
  rows_to_display: number = 0;
  rows_total: number = 0;
  rows_starting_number: number = 0;
  rows_ending_number: number = 0;


  old_data: string;

  returndata: string;

  RecList: SearchTable[] = [];

  Record: SearchTable = new SearchTable;

  showDiv = false;

  bShowMore = true;
  indx: number = 0;
  indx2: number = 0;


  loading = false;

  _selectedItem: SearchTable;


  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private loginservice: LoginService,
    private gs: GlobalService
  ) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

  }
  // ngAfterViewInit() {
  //   // this.itms_field.changes
  //   // .subscribe((queryChanges) => {
  //   //   this.itms_field.first.nativeElement.focus();
  //   // });
  //   // if (!this.gs.isBlank(this.cbtn_field))
  //   //   this.cbtn_field.nativeElement.focus();
  // }
  Focus() {
    if (!this.disabled) {
      setTimeout(() => {
        this.inputbox.nativeElement.focus();
      }, 0);
    }

  }

  eventHandler(KeyCode: any) {
    this.List();
  }

  More() {
    // if (this.rows_ending_number < this.rows_total)
    // {
    //     this.rows_starting_number = this.rows_ending_number +1;
    //     this.rows_ending_number = this.rows_ending_number + this.rows_to_display;
    //     this.List('NEXT');
    // }
    this.rows_starting_number = this.rows_ending_number + 1;
    this.rows_ending_number = this.rows_ending_number + this.rows_to_display;
    this.List('NEXT');
  }

  PageEvents(action) {
    this.List(action);
  }



  List(_action: string = 'NEW') {
    this.loading = true;

    let row1 = 0;
    let row2 = 0;

    if (_action == "NEW") {
      this.rows_to_display = 10;
      this.rows_starting_number = 1;
      this.rows_ending_number = this.rows_to_display;
      row1 = this.rows_starting_number;
      row2 = this.rows_ending_number;
      this.bShowMore = true;
    }
    else {
      row1 = this.rows_starting_number;
      row1 = this.rows_ending_number;
    }
    if (_action == 'PREV') {
      row1 = this.rows_starting_number - this.rows_to_display;
      row2 = this.rows_ending_number - this.rows_to_display;
    }
    if (_action == 'NEXT') {
      row1 = this.rows_ending_number + 1;
      row2 = this.rows_ending_number + this.rows_to_display;
    }

    let SearchData = {
      action: _action,
      rows_to_display: this.rows_to_display,
      rows_starting_number: row1,
      rows_ending_number: row2,
      type: this._tabletype,
      subtype: this._subtype,
      parentid: this._parentid,
      searchstring: this._displaydata,
      where: this._where,
      comp_code: this.gs.company_code,
      branch_code: this._branchcode
    };

    this.loginservice.LovList(SearchData)
      .subscribe(response => {
        //this.RecList = response.list;
        //this.rows_total = response.rows_total;

        // if (this.rows_ending_number >= this.rows_total)
        //     this.bShowMore = false;

        if (response.list == null) {
          this.SelectedItem('', null);
          this.showDiv = false;
          return;
        }

        //this.RecList.push(...response.list);

        this.RecList = response.list;

        this.loading = false;

        if (_action == "NEW") {
          if (this.RecList.length === 0) {
            this.SelectedItem('', null);
            this.showDiv = false;
          }
          else if (this.RecList.length === 1) {
            this.SelectedItem('', this.RecList[0]);
            this.showDiv = false;
          }
        }
        if (this.RecList.length > 1) {

          this.rows_starting_number = row1;
          this.rows_ending_number = row2;

          this.showDiv = true;


          this._selectedItem = this.RecList[0];

          setTimeout(() => {
            this.lov.nativeElement.focus();
            this.lov.nativeElement.scrollTop = this.lov.nativeElement.scrollHeight;
          }, 0);
        }
      },
        error => {
          this.loading = false;
          alert(error.error);

        }
      );
  }

  ChangeSelection(item: SearchTable, index : number = 0) {
    this._selectedItem = item;
    setTimeout(() => {
      //this.lov.nativeElement.focus();
      this.inputs.toArray()[index].nativeElement.focus();
      
    }, 0);
  }

  SelectedItem(_source: string, _Record: SearchTable) {
    if (_Record == null) {
      this.inputdata.controlname = this._controlname;
      this.inputdata.uid = this._uid;
      this.inputdata.id = "";
      this.inputdata.code = "";
      this.inputdata.name = "";
      this.inputdata.rate = 0;
      this.inputdata.subtype = "";

      this.inputdata.col1 = '';
      this.inputdata.col2 = '';
      this.inputdata.col3 = '';
      this.inputdata.col4 = '';
      this.inputdata.col5 = '';
      this.inputdata.col6 = '';

      this.inputdata.col7 = '';
      this.inputdata.col8 = '';
      this.inputdata.col9 = '';

      this.displaydata = '';
      this.parentid = '';



    }
    else {
      this.inputdata.controlname = this._controlname;
      this.inputdata.uid = this._uid;
      this.inputdata.id = _Record.id;
      this.inputdata.code = _Record.code;
      this.inputdata.name = _Record.name;
      this.inputdata.rate = _Record.rate;

      if (this._displaycolumn == "CODE")
        this._displaydata = _Record.code;
      if (this._displaycolumn == "NAME")
        this._displaydata = _Record.name;


      this._parentid = _Record.parentid;
      this.inputdata.subtype = _Record.subtype;

      this.inputdata.col1 = _Record.col1;
      this.inputdata.col2 = _Record.col2;
      this.inputdata.col3 = _Record.col3;
      this.inputdata.col4 = _Record.col4;
      this.inputdata.col5 = _Record.col5;
      this.inputdata.col6 = _Record.col6;
      this.inputdata.col7 = _Record.col7;
      this.inputdata.col8 = _Record.col8;
      this.inputdata.col9 = _Record.col9;
    }


    this.showDiv = false;
    this.ValueChanged.emit(this.inputdata);
    this.RecList = [];
  }

  onfocus() {
    if (this.showDiv) {
      if (this.old_data != this._displaydata)
        this._displaydata = "";
    }
    this.old_data = this._displaydata;
    this.RecList = [];
    this.showDiv = false;
  }

  onBlur() {
    let localdata: string = "";
    if (this._displaydata === null)
      localdata = '';
    else
      localdata = this._displaydata;

    if (this.old_data != localdata) {
      if (localdata == '')
        this.SelectedItem('', null);
      else
        this.List();
    }
  }

  Cancel() {
    let localdata: string = "";
    if (this._displaydata === null)
      localdata = '';
    else
      localdata = this._displaydata;

    if (this.old_data != localdata) {
      this.SelectedItem('', null);
    }

    if (!this.disabled) {
      setTimeout(() => {
        this.inputbox.nativeElement.focus();
      }, 0);
    }

    this.showDiv = false;
  }


  setMyStyles() {
    let styles = {
      'border': '1px solid rgba(0,0,255,0.25)',
      'margin-left': '0px',
      'border-radius': '0px',
    };
    return styles;
  }

  onSelectionChange(item: SearchTable) {

  }

  TableKeyDown(event: KeyboardEvent, _rec: SearchTable) {
    if (event.key === 'Escape') {
      this.Cancel();
    }
  }

  ListKeydown(event: KeyboardEvent, _rec: SearchTable) {
    
    if (event.key === 'Tab') {
      event.preventDefault();
    }
    if (event.key === 'Enter') {
      this.SelectedItem('LIST', _rec)
    }
    if (event.key === 'Escape') {
      this.Cancel();
    }
    if (event.key === 'PageUp') {
      this.List('PREV');
    }
    if (event.key === 'PageDown') {
      this.List('NEXT');
    }
  }
  MoreKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.More();
    }
  }
}



