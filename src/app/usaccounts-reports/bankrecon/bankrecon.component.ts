import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, BankReconModel, Tbl_acc_ledger } from '../models/Tbl_acc_ledger';
import { PageQuery } from '../../shared/models/pageQuery';
import { BankReconService } from '../services/bankrecon.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'bankrecon',
  templateUrl: './bankrecon.component.html'
})
export class BankReconComponent implements OnInit {

  /*
   Joy
 */
  modal: any;
  tab: string = 'main';
  report_title: string = '';
  report_url: string = '';
  report_searchdata: any = {};
  report_menuid: string = '';


  errorMessage$: Observable<string>;
  records$: Observable<Tbl_acc_ledger[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: BankReconService
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

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
    if (actions.outputformat === "PRINT")
      this.PrintRpt(actions);
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
      type: this.mainservice.param_type,
      origin: 'mblusage-page',
      mode: 'ADD'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));

  }
  edit(_record: Tbl_acc_ledger) {
    if (!this.mainservice.canEdit) {
      alert('Insufficient User Rights')
      return;
    }

    let parameter = {
      menuid: this.mainservice.menuid,
      pkid: _record.acc_name,
      type: '',
      origin: 'mblusage-page',
      mode: 'EDIT'
    };
    this.gs.Naviagete('Silver.Other.Trans/MblUsageEditPage', JSON.stringify(parameter));
  }

  Close() {
    this.location.back();
  }

  Reconcile(_rec: Tbl_acc_ledger, datemodal: any = null) {

    this.mainservice.ReconcileRecord(_rec);
    this.modal = this.modalservice.open(datemodal, { centered: true });
  }

  CloseModal() {
    this.modal.close();
  }

  SaveReconDate() {
    this.mainservice.SaveDate();
    this.CloseModal();
  }

  PrintRpt(_searchdata: any) {
    if (!this.mainservice.canPrint) {
      alert('Insufficient User Rights');
      return;
    }

    if (!this.mainservice.RecordsExist()) {
      alert('List Not Found');
      return;
    }

    this.report_title = 'Bank Reconciliation';
    this.report_url = '/api/BankReconciled/GetReconRpt';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.gs.getGuid();
    this.report_searchdata.ACC_ID = _searchdata.searchQuery.accId; 
    this.report_searchdata.ACC_NAME = _searchdata.searchQuery.accName; 
    this.report_searchdata.FDATE = _searchdata.searchQuery.sdate;
    this.report_searchdata.EDATE = _searchdata.searchQuery.edate;
    this.report_searchdata.COMP_NAME = this.gs.company_name;
    this.report_menuid = this.mainservice.menuid;
    this.tab = 'report';

  }
  callbackevent(event: any) {
    this.tab = 'main';
  }
}
