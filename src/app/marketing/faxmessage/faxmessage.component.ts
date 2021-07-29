import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Message } from '../models/tbl_cargo_message';
import { SearchQuery } from '../models/tbl_cargo_message';
import { PageQuery } from '../../shared/models/pageQuery';

import { FaxMessageService } from '../services/faxmessage.service';

@Component({
  selector: 'app-faxmessage',
  templateUrl: './faxmessage.component.html'
})
export class FaxMessageComponent implements OnInit {

  // 02-07-2019 Created By Ajith  

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Message[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: FaxMessageService
  ) { }

  ngOnInit() {
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {
    this.gs.checkAppVersion();
    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
  }

  searchEvents(actions: any) {
    this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
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
      origin: 'faxmessage-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Marketing.Quotation/FaxMessageEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_Cargo_Message) {

    // if (_record.qtnr_slno == null || _record.qtnr_slno.toString().trim() == "") {
    //   alert('Cannot View/Edit This Row')
    //   return;
    // }

    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.mainservice.menuid,
      pkid: _record.msg_pkid,
      origin: 'faxmessage-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Marketing.Quotation/FaxMessageEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

  ShowFile(_rec: Tbl_Cargo_Message) {

    let filepath = "Files_Folder\\" + this.gs.FILES_FOLDER + "\\Files\\";
    let filename: string = "";
    let filedisplayname: string = "";
    //filename = this.gs.FS_APP_FOLDER + this.gs.WWW_FILES_URL + _rec.qtnr_file_id;
    // filename = this.gs.FS_APP_FOLDER + filepath + _rec.qtnr_file_id;
    // filedisplayname = _rec.qtnr_file_name;
    // this.Downloadfile(filename, "", filedisplayname);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.FS_APP_FOLDER, filename, filetype, filedisplayname);
  }

}
