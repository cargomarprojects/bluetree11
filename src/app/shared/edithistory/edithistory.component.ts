import { Component, OnInit, Input, Output, OnDestroy, SimpleChange, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../core/services/global.service';
import { Table_User_Edit_History } from '../models/table_user_edit_history';
import { EditHistoryService } from '../services/edithistory.service';
import { PageQuery } from '../../shared/models/pageQuery';

@Component({
  selector: 'app-edithistory',
  templateUrl: './edithistory.component.html'
})
export class UserEditHistoryComponent implements OnInit {

  public errorMessage: string = '';
  public tab: string = 'main';

  private _parentid: string;
  @Input() set parentid(value: string) {
    this._parentid = value;
  }

  pageQuery: PageQuery = <PageQuery>{action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 };
  // @Output() callbackevent = new EventEmitter<any>();

  modal: any;
  public records: Table_User_Edit_History[] = [];

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private http2: HttpClient,
    private mainservice: EditHistoryService,
    private gs: GlobalService) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    this.gs.checkAppVersion();
    pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
  }

  HistoryFill(_modal: any = null) {
    if (this.gs.isBlank(this._parentid)) {
      alert('Invalid ID');
      return;
    }

    var SearchData = this.gs.UserInfo;
    SearchData.PARENT_ID = this._parentid;
    SearchData.action = 'NEW';
    SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
    SearchData.page_count = 0;
    SearchData.page_rows = 0;
    SearchData.page_current = -1;
     

    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;
      this.modal = this.modalservice.open(_modal, { centered: true });
    }, error => {
      alert(this.gs.getError(error));
    });

  }
  pageEvents(actions: any) {
    
    var SearchData = this.gs.UserInfo;
    SearchData.PARENT_ID = this._parentid;
    SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
    SearchData.action = actions.pageQuery.action;
    SearchData.page_count = actions.pageQuery.page_count;
    SearchData.page_rows = actions.pageQuery.page_rows;
    SearchData.page_current = actions.pageQuery.page_current;
    this.mainservice.List(SearchData).subscribe(response => {
      this.records = response.list;
    }, error => {
      alert(this.gs.getError(error));
    });
      
  }

     
   
  CloseModal(_type: string) {

    // if (this.callbackevent)
    //   this.callbackevent.emit({ action: _type});

    this.modal.close();
  }

}
