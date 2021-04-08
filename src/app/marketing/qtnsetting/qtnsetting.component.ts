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
 

  edit(_record: Tbl_Cargo_Qtnm) {

    if (this.gs.isBlank(_record.qtnm_no)) {
      alert('Cannot View/Edit This Row')
      return;
    }

    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.qtnm_no,
      subject: _record.qtnm_to_name,
      title: this.mainservice.title,
      origin: 'qtnsetting-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Marketing.Quotation/QuotationSettingEditPage', JSON.stringify(parameter));
  }
}
