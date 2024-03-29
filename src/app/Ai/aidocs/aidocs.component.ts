import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { DB_Tbl_Mast_Files, Tbl_Mast_Filesm } from '../models/Tbl_mast_filesm';
import { SearchQuery } from '../models/Tbl_mast_filesm';
import { PageQuery } from '../../shared/models/pageQuery';
import { AiDocsService } from '../services/aidocs.service';


@Component({
  selector: 'app-aidocs',
  templateUrl: './aidocs.component.html'
})
export class aidocsComponent implements OnInit {

  /*
   Joy
 */

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Mast_Filesm []>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  docList$: Observable<DB_Tbl_Mast_Files []>;


  showAttachment = false;
  attach_title: string = '';
  attach_parentid: string = '';
  attach_subid: string = '';
  attach_type: string = '';
  attach_typelist: any = {};
  attach_tablename: string = '';
  attach_tablepkcolumn: string = '';
  attach_refno: string = '';
  attach_customername: string = '';
  attach_updatecolumn: string = '';
  attach_viewonlysource: string = '';
  attach_viewonlyid: string = '';
  attach_filespath: string = '';
  attach_filespath2: string = '';




  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: AiDocsService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {

    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.docList$ = this.mainservice.data$.pipe(map(res => res.DocList));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));

  }

  searchEvents(actions: any) {
    this.showAttachment =false;
    this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.showAttachment =false;
    this.mainservice.Search(actions, 'PAGE');
  }

  NewRecord() {
    if (!this.mainservice.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: '',
      type: '',
      origin: 'aidocs-page',
      mode: 'ADD'
    };
    this.gs.Naviagete2('Ai/AiDocsEditPage',  parameter);

  }
  edit(_record: Tbl_Mast_Filesm) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.file_pkid ,
      type: '',
      origin: 'aidocs-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete2('Ai/AiDocsEditPage',  parameter);
  }

  ShowDocumentList(_docid : string){
    //this.mainservice.ShowDocumentList(_DocID);
    this.initAttachment(_docid);
  }

  initAttachment(_docid : string ){
    let TypeList: any[] = [];
    TypeList = [{ "code": "MBL", "name": "MBL" }, { "code": "HBL", "name": "HBL" }, { "code": "SHIPMENT-INVOICE", "name": "SHIPMENT-INVOICE" }, { "code": "PACKING LIST", "name": "PACKING LIST" }];
    this.attach_title = 'Documents';
    this.attach_parentid = _docid;
    this.attach_subid = '';
    this.attach_type = '';
    this.attach_typelist = TypeList;
    this.attach_tablename = 'mast_filesm';
    this.attach_tablepkcolumn = 'file_pkid';
    this.attach_refno = '';
    this.attach_customername = '';
    this.attach_updatecolumn = 'REC_FILES_ATTACHED';
    this.attach_viewonlysource = '';
    this.attach_viewonlyid = '';
    this.attach_filespath = '';
    this.attach_filespath2 = '';
    this.showAttachment = true;
    
}



  Close() {
    this.location.back();
  }


}
