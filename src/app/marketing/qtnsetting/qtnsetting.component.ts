import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Qtnm } from '../models/tbl_cargo_qtnm';
 
import { QtnSettingService } from '../services/qtnsetting.service';

@Component({
  selector: 'app-qtnsetting',
  templateUrl: './qtnsetting.component.html'
})
export class QtnSettingComponent implements OnInit {

  // 02-07-2019 Created By Ajith  
  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Qtnm[]>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: QtnSettingService
  ) { }

  ngOnInit() {
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {
    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
  }
 
   
  Close() {
    this.location.back();
  }

  ShowFile(_rec: Tbl_Cargo_Qtnm) {

    let filepath = "Files_Folder\\" + this.gs.FILES_FOLDER + "\\Files\\";
    let filename: string = "";
    let filedisplayname: string = "";
    // //filename = this.gs.FS_APP_FOLDER + this.gs.WWW_FILES_URL + _rec.qtnr_file_id;
    // filename = this.gs.FS_APP_FOLDER + filepath + _rec.qtnr_file_id;
    // filedisplayname = _rec.qtnr_file_name;
    this.Downloadfile(filename, "", filedisplayname);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.FS_APP_FOLDER, filename, filetype, filedisplayname);
  }

}
