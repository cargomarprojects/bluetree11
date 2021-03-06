import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Mast_Addressm } from '../models/Tbl_Mast_Addressm';
import { PartyAddrService } from '../services/partyaddr.service';

@Component({
  selector: 'app-partyaddr-list',
  templateUrl: './partyaddr-list.component.html'
})
export class PartyAddrListComponent implements OnInit {

  errorMessage: string;
  party_pkid: string;
  party_name: string;

  menuid: string;
  title: string;
  isAdmin: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canSave: boolean;
  canDelete:boolean;

  records: Tbl_Mast_Addressm[]

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PartyAddrService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    if (this.route.snapshot.queryParams.parameter == null) {
      this.menuid = this.route.snapshot.queryParams.menuid;
      this.party_pkid = this.route.snapshot.queryParams.parentid;
      this.party_name = this.route.snapshot.queryParams.party_name;
    } else {
      const options = JSON.parse(this.route.snapshot.queryParams.parameter);
      this.menuid = options.menuid;
      this.party_pkid = options.parentid;
      this.party_name = options.party_name;
    }

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    // this.title = this.gs.getTitle(this.menuid);
    this.title = 'Address';
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canDelete = this.gs.canDelete(this.menuid);
    this.List('SCREEN');
  }


  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.TYPE = 'PARTYS';
    SearchData.PARENT_ID = this.party_pkid;

    this.mainservice.List(SearchData).subscribe(response => {
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
      appid:this.gs.appid,
      menuid: this.menuid,
      pkid: '',
      mode: 'ADD',
      parentid: this.party_pkid,
      party_name: this.party_name
    };
    this.gs.Naviagete2('Silver.Master/PartyAddrEditPage',  parameter);

  }

  edit(_record: Tbl_Mast_Addressm) {
    if (!this.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      appid:this.gs.appid,
      menuid: this.menuid,
      pkid: _record.add_pkid,
      mode: 'EDIT',
      parentid: this.party_pkid,
      party_name: this.party_name
    };
    this.gs.Naviagete2('Silver.Master/PartyAddrEditPage',  parameter);
  }

  DeleteRow(_rec: Tbl_Mast_Addressm) {

    if (!confirm("DELETE " + _rec.add_address1)) {
        return;
    }

    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.pkid = _rec.add_pkid;
    SearchData.remarks = _rec.add_address1;
    this.mainservice.DeleteRecord(SearchData)
        .subscribe(response => {
            if (response.retvalue == false) {
                this.errorMessage = response.error;
                alert(this.errorMessage);
            }
            else {
                this.records.splice(this.records.findIndex(rec => rec.add_pkid == _rec.add_pkid), 1);
            }
        }, error => {
            this.errorMessage = this.gs.getError(error);
            alert(this.errorMessage);
        });
}


  Close() {
    this.location.back();
  }
}
