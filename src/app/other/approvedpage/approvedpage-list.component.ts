import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Approved } from '../models/tbl_cargo_approved';
import { ApprovedPageService } from '../services/approvedpage.service';

@Component({
  selector: 'app-approvedpage-list',
  templateUrl: './approvedpage-list.component.html'
})
export class ApprovedPageListComponent implements OnInit {

  errorMessage: string;
  mbl_pkid: string;
  mbl_refno: string;
  mbl_mode: string;
  doc_type: string;
  req_type: string;

  menuid: string;
  title: string;
  isAdmin: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;
  origin: string;
  canDelete: boolean;

  tab: string = 'main';
  attach_pkid: string = "";
  attach_typelist: any = {};
  attach_type: string = "";

  records: Tbl_Cargo_Approved[]
  is_locked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: ApprovedPageService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mbl_pkid = this.route.snapshot.queryParams.mbl_pkid;
      this.mbl_refno = this.route.snapshot.queryParams.mbl_refno;
      this.doc_type = this.route.snapshot.queryParams.doc_type;
      this.req_type = this.route.snapshot.queryParams.req_type;
      this.origin = this.route.snapshot.queryParams.origin;
      this.is_locked = JSON.parse(this.route.snapshot.queryParams.is_locked);
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.mbl_pkid = options.mbl_pkid;
      this.mbl_refno = options.mbl_refno;
      this.doc_type = options.doc_type;
      this.req_type = options.req_type;
      this.origin = options.origin;
      this.is_locked = options.is_locked;
    }
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canDelete = this.gs.canDelete(this.menuid);

    this.List('SCREEN');
  }


  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.mbl_pkid = this.mbl_pkid;
    SearchData.ISADMIN = this.isAdmin == true ? 'Y' : 'N';
    this.mainservice.GeneralList(SearchData).subscribe(response => {
      this.records = response.list;

    }, error => {
      this.errorMessage = this.gs.getError(error)
    });
  }


  NewRecord() {
    if (!this.canAdd) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.menuid,
      pkid: '',
      mode: 'ADD',
      mbl_pkid: this.mbl_pkid,
      mbl_refno: this.mbl_refno,
      doc_type: this.doc_type,
      req_type: this.req_type,
      is_locked: this.is_locked
    };
    this.gs.Naviagete2('Silver.Other.Trans/ApprovedPageEdit', parameter);

  }

  edit(_record: Tbl_Cargo_Approved) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.menuid,
      pkid: _record.ca_pkid,
      mode: 'EDIT',
      mbl_pkid: this.mbl_pkid,
      mbl_refno: this.mbl_refno,
      doc_type: this.doc_type,
      req_type: this.req_type,
      is_locked: this.is_locked
    };
    this.gs.Naviagete2('Silver.Other.Trans/ApprovedPageEdit', parameter);
  }

  Close() {
    // if (this.origin == "seaexp-master-page" || this.origin == "seaimp-master-page" || this.origin == "airexp-master-page" || this.origin == "airimp-master-page" || this.origin == "other-general-page")
    //   this.gs.LinkReturn(this.origin, this.mbl_pkid, '');
    // else
    this.location.back();
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

  getRouteDet(_type: string, _mode: string, _record: Tbl_Cargo_Approved = null) {

    if (_type == "L") {
      if ((_mode == "ADD" && this.canAdd) || (_mode == "EDIT" && this.canEdit))
        return "/Silver.Other.Trans/ApprovedPageEdit";
      else
        return null;
    } else if (_type == "P") {

      if (_record == null) {
        if (!this.canAdd)
          return null;
        return {
          appid: this.gs.appid,
          menuid: this.menuid,
          pkid: '',
          mode: 'ADD',
          mbl_pkid: this.mbl_pkid,
          mbl_refno: this.mbl_refno,
          doc_type: this.doc_type,
          req_type: this.req_type,
          is_locked: this.is_locked == true ? 'Y' : 'N'
        };
      }
      if (!this.canEdit)
        return null;
      return {
        appid: this.gs.appid,
        menuid: this.menuid,
        pkid: _record.ca_pkid,
        mode: 'EDIT',
        mbl_pkid: this.mbl_pkid,
        mbl_refno: this.mbl_refno,
        doc_type: this.doc_type,
        req_type: this.req_type,
        is_locked: this.is_locked == true ? 'Y' : 'N'
      };
    } else
      return null;
  }

  RemoveRow(_rec: Tbl_Cargo_Approved) {
    this.errorMessage = '';
    let sRemarks: string = '';

    // if (this.is_locked) {
    //   this.errorMessage = "Cannot Delete, Locked";
    //   alert(this.errorMessage);
    //   return;
    // }

    if (!this.isAdmin) {
      if (_rec.ca_user_name != this.gs.user_name) {
        this.errorMessage = "Cannot Delete, Requested by another user";
        alert(this.errorMessage);
        return;
      }
    }
    
    if (!confirm("DELETE RECORD REQUEST# " + _rec.ca_reqno.toString())) {
      return;
    }

    sRemarks = _rec.ca_reqno.toString();
    if (this.req_type != "REQUEST") {
      if (!this.gs.isBlank(_rec.ca_approvedby_name))
        sRemarks += " Approved By " + _rec.ca_approvedby_name;
    }
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = _rec.ca_pkid;
    SearchData.reqtype = this.req_type;
    SearchData.remarks = sRemarks;
    this.mainservice.DeleteRecord(SearchData)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        }
        else {
          this.records.splice(this.records.findIndex(rec => rec.ca_pkid == _rec.ca_pkid), 1);
          // this.NewRecord();
        }
      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }

}
