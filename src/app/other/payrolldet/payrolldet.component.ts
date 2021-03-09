import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Payrolldet } from '../models/tbl_cargo_payrolldet';
import { SearchQuery } from '../models/tbl_cargo_payrolldet';
import { PageQuery } from '../../shared/models/pageQuery';
import { PayrollDetService } from '../services/payrolldet.service';

@Component({
  selector: 'app-payrolldet',
  templateUrl: './payrolldet.component.html'
})
export class PayrollDetComponent implements OnInit {


  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Cargo_Payrolldet[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: PayrollDetService
  ) { }

  ngOnInit() {
    this.mainservice.init(this.route.snapshot.queryParams.parameter);
    this.initPage();
  }

  initPage() {

    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));

  }

  searchEvents(actions: any) {
    if (actions.outputformat == 'GENERATE')
      this.mainservice.Generate(actions)
    else
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
      origin: 'payrolldet-page'
    };
    this.gs.Naviagete('Silver.Other.Trans/PayrollEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_Cargo_Payrolldet) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.cpd_pkid,
      mode: 'EDIT',
      emp_name: _record.cpd_emp_name,
      origin: 'payrolldet-page'
    };
    this.gs.Naviagete('Silver.Other.Trans/PayrollEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }


}
