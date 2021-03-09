import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Payrolldet, } from '../../other/models/tbl_cargo_payrolldet';
import { SearchQuery } from '../../other/models/tbl_cargo_payrolldet';
import { PageQuery } from '../../shared/models/pageQuery';
import { PayrollMasterService } from '../services/payrollmaster.service';
import {Tbl_Mast_Partym } from '../../master/models/Tbl_Mast_Partym';

@Component({
  selector: 'app-payrollmaster',
  templateUrl: './payrollmaster.component.html'
})
export class PayrollMasterComponent implements OnInit {


  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Mast_Partym[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PayrollMasterService
  ) { }

  ngOnInit() {
    this.mainservice.init(this.route.snapshot.queryParams);
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
      emp_name: '',
      origin: 'payrollmaster-page'
    };
    this.gs.Naviagete('Silver.Master/PayrollPageEditView', JSON.stringify(parameter));

  }
  edit(_record: Tbl_Mast_Partym) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.gen_pkid,
      mode: 'EDIT',
      emp_name: _record.gen_name,
      origin: 'payrollmaster-page'
    };
    this.gs.Naviagete('Silver.Master/PayrollPageEditView', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

}
