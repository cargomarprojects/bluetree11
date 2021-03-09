import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Approved } from '../models/tbl_cargo_approved';
import { SearchQuery } from '../models/tbl_cargo_approved';
import { PageQuery } from '../../shared/models/pageQuery';

import { ApprovedPageService } from '../services/approvedpage.service';
import { invalid } from '@angular/compiler/src/render3/view/util';


@Component({
  selector: 'app-approvedpage',
  templateUrl: './approvedpage.component.html'
})
export class ApprovedPageComponent implements OnInit {

  // 02-07-2019 Created By Ajith  

  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Approved[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;
  sub: any;
  tab: string = 'main';
  attach_pkid: string = "";
  attach_typelist: any = {};
  attach_type: string = "";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: ApprovedPageService
  ) { }

  ngOnInit() {
    // this.mainservice.init(this.route.snapshot.queryParams);
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.mainservice.init(params);
        // this.mainservice.Search('SCREEN');
      }
    });

    this.initPage();
  }

  initPage() {

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
      menuid: this.mainservice.menuid,
      pkid: '',
      mode: 'ADD',
      mbl_pkid: '',
      mbl_refno: '',
      mbl_mode: 'GENERAL',
      origin: 'approved-page'
    };
    this.gs.Naviagete('Silver.Other.Trans/ApprovedPageEdit', JSON.stringify(parameter));
  }

  edit(_record: Tbl_Cargo_Approved) {

    if (this.mainservice.param_type == "APPROVED REPORT" || this.mainservice.param_type == "REQUEST REPORT")
      return;

    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.ca_pkid,
      mode: 'EDIT',
      mbl_pkid: _record.ca_ref_id,
      mbl_refno: _record.ca_ref_no,
      doc_type: _record.ca_doc_type,
      req_type: this.mainservice.param_type
    };
    this.gs.Naviagete('Silver.Other.Trans/ApprovedPageEdit', JSON.stringify(parameter));
  }

  editmaster(_record: Tbl_Cargo_Approved) {
    let sID: string = (_record.ca_ref_id != null) ? _record.ca_ref_id.toString() : "";
    let REFNO: string = _record.ca_ref_no != null ? _record.ca_ref_no.toString() : "";
    let sMode: string = _record.ca_mode != null ? _record.ca_mode.toString() : "";
    if (sID == "") {
      alert('Invalid Record Selected');
      return;
    }
    this.gs.LinkPage("REFNO", sMode, REFNO, sID);
  }

  edithouse(_record: Tbl_Cargo_Approved) {
    let sID: string = (_record.ca_ref_id != null) ? _record.ca_ref_id.toString() : "";
    let REFNO: string = _record.ca_ref_no != null ? _record.ca_ref_no.toString() : "";
    let sMode: string = _record.ca_mode != null ? _record.ca_mode.toString() : "";
    let HBLID: string = _record.ca_hbl_id != null ? _record.ca_hbl_id.toString() : "";
    if (HBLID == "") {
      alert('Invalid Record Selected');
      return;
    }
    this.gs.LinkPage("HOUSE", sMode, REFNO, sID, HBLID);
  }

  editinvoice(_record: Tbl_Cargo_Approved) {

    let sID: string = (_record.ca_ref_id != null) ? _record.ca_ref_id.toString() : "";
    let REFNO: string = _record.ca_ref_no != null ? _record.ca_ref_no.toString() : "";
    let sMode: string = _record.ca_mode != null ? _record.ca_mode.toString() : "";
    let INVID: string = _record.ca_inv_id != null ? _record.ca_inv_id.toString() : "";
    if (sID == "" || INVID == "") {
      alert('Invalid Record Selected');
      return;
    }

    this.gs.LinkPage("INVNO", sMode, REFNO, sID, "", INVID);
  }


  Close() {
    this.location.back();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  AttachRow(_rec: Tbl_Cargo_Approved) {
    let TypeList: any[] = [];
    TypeList = [{ "code": "APPROVAL REQUEST", "name": "APPROVAL REQUEST" }];
    this.attach_pkid = _rec.ca_pkid;
    this.attach_typelist = TypeList;
    this.attach_type = 'APPROVAL REQUEST'
    this.tab = 'attachment';
  }
  callbackevent() {
    this.tab = 'main';
  }

}
