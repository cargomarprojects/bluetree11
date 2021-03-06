import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_slip } from '../models/tbl_cargo_slip';
import { MessengerSlipService } from '../services/messengerslip.service';

@Component({
  selector: 'app-messengerslip-list',
  templateUrl: './messengerslip-list.component.html'
})
export class MessengerSlipListComponent implements OnInit {

  errorMessage: string;
  mbl_pkid: string;
  mbl_refno: string;
  mbl_mode: string;

  menuid: string;
  title: string;
  isAdmin: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;

  origin: string;
  records: Tbl_cargo_slip[]
  is_locked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: MessengerSlipService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.mbl_pkid = this.route.snapshot.queryParams.mbl_pkid;
      this.mbl_refno = this.route.snapshot.queryParams.mbl_refno;
      this.mbl_mode = this.route.snapshot.queryParams.mbl_mode;
      this.is_locked = JSON.parse(this.route.snapshot.queryParams.is_locked);
      this.origin = this.route.snapshot.queryParams.origin;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.mbl_pkid = options.mbl_pkid;
      this.mbl_refno = options.mbl_refno;
      this.mbl_mode = options.mbl_mode;
      this.is_locked = options.is_locked;
      this.origin = options.origin;
    }
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);

    this.List('SCREEN');
  }


  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.mbl_pkid = this.mbl_pkid;

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
      mbl_mode: this.mbl_mode,
      is_locked: this.is_locked
    };
    this.gs.Naviagete2('Silver.Other.Trans/MessengerSlipEdit',  parameter);

  }

  edit(_record: Tbl_cargo_slip) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid: this.gs.appid,
      menuid: this.menuid,
      pkid: _record.cs_pkid,
      mode: 'EDIT',
      mbl_pkid: this.mbl_pkid,
      mbl_refno: this.mbl_refno,
      mbl_mode: this.mbl_mode,
      is_locked: this.is_locked
    };
    this.gs.Naviagete2('Silver.Other.Trans/MessengerSlipEdit', parameter);
  }

  Close() {

    this.location.back();
  }

}
