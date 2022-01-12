import { Component, OnInit, Input, Output, OnDestroy, SimpleChange, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalService } from '../../core/services/global.service';
import { Table_User_Edit_History } from '../models/table_user_edit_history';
import { EditHistoryService } from '../services/edithistory.service';
import { PageQuery } from '../../shared/models/pageQuery';
import { SearchQuery } from '../models/table_user_edit_history';


@Component({
  selector: 'app-edithistory',
  templateUrl: './edithistory.component.html'
})
export class UserEditHistoryComponent implements OnInit {

  errorMessage$: Observable<string>;
  records$: Observable<Table_User_Edit_History[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;
  private _parentid: string;
  @Input() set parentid(value: string) {
    this._parentid = value;
  }
  
  public records: Table_User_Edit_History[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http2: HttpClient,
    private mainservice: EditHistoryService,
    private gs: GlobalService) {
  }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {
    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
  }
 
  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  onBlur(_feild: string) {

  }

  Close() {
    this.location.back();
  }

  HistoryFill(actions: any,_modal: any = null) {
    if (this.gs.isBlank(this._parentid)) {
      alert('Invalid ID');
      return;
    }
    
    this.mainservice.parentid = this._parentid;
    this.mainservice.Search(actions, 'SEARCH',_modal);
  }
      

}
