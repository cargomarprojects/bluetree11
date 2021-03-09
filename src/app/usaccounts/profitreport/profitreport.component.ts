import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Invoice_Profit } from '../models/Tbl_Cargo_Invoice_Profit';
import { invoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-profit-report',
  templateUrl: './profitreport.component.html'
})
export class ProfitReportComponent implements OnInit {

  private errormessage: string;
  private mbl_pkid: string;
  private mbl_refno: string;
  private mbl_type: string;
  private showdeleted: boolean;

  private id: string;
  private menuid: string;

  private title: string;
  private isAdmin: boolean;
  private canAdd: boolean;
  private canEdit: boolean;
  private canSave: boolean;

  income: number = 0;
  expense: number = 0;
  profit: number = 0;
  ar_bal: number = 0;
  ap_bal: number = 0;


  report_url: string;
  report_searchdata: any = {};
  report_menuid: string;


  records: Tbl_Cargo_Invoice_Profit[];

  main_type: string = 'INVOICE';

  refno: string = '';
  mblno: string = '';
  pol: string = '';
  pod: string = '';
  WT: number = 0;
  CHWT: number = 0;
  CBM: number = 0;

  radio_cbm: string = 'CBM';


  filename : string ;
  filetype  : string ;
  filedisplayname  : string ;
  filename2 : string ;
  filetype2  : string ;
  filedisplayname2  : string ;

  tab: string = 'main';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: invoiceService
  ) { }

  ngOnInit() {
    this.init(this.route.snapshot.queryParams.parameter);
    this.List('SCREEN');
  }


  public init(params: any) {

    const options = JSON.parse(params);


    this.menuid = options.menuid;
    this.mbl_type = options.mbl_type;
    this.mbl_pkid = options.mbl_pkid;
    this.id = this.mbl_pkid;
    this.mbl_refno = options.mbl_refno;
    this.showdeleted = false;

    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.title = this.gs.getTitle(this.menuid);
    this.canAdd = this.gs.canAdd(this.menuid);
    this.canEdit = this.gs.canEdit(this.menuid);
    this.canSave = this.canAdd || this.canEdit;
  }

  List(action: string = '') {
    var SearchData = this.gs.UserInfo;
    SearchData.outputformat = 'SCREEN';
    SearchData.action = 'NEW';
    SearchData.PKID = this.mbl_pkid;
    SearchData.INV_TYPE = this.mbl_type; // OE AE
    SearchData.REP_TYPE = this.main_type; // INVOIOCE OR HOUSE
    if (this.main_type == 'HOUSE')
      SearchData.REP_BASEDON = this.radio_cbm;
    else
      SearchData.REP_BASEDON = '';


     this.mainservice.ProfitReport(SearchData).subscribe(response => {

      this.records = response.list;
      this.refno = response.record.mbl_refno;
      this.mblno = response.record.mbl_no;
      this.pol = response.record.mbl_pol_name;
      this.pod = response.record.mbl_pod_name;
      this.WT = response.record.mbl_weight;
      this.CHWT = response.record.mbl_chwt;
      this.CBM = response.record.mbl_cbm;

      this.filename = response.filename;
      this.filetype = response.filetype;
      this.filedisplayname = response.filedisplayname;
      this.filename2 = response.filename2;
      this.filetype2 = response.filetype2;
      this.filedisplayname2 = response.filedisplayname2;

    }, error => {
      this.errormessage = this.gs.getError(error)
    });
  }


  DisplayProfit() {
    return;
  }

  Print() {
    this.report_url = '';
    this.report_searchdata = this.gs.UserInfo;
    this.report_searchdata.pkid = this.mbl_pkid;
    this.report_menuid = this.gs.MENU_SE_MASTER_PROFIT_REPORT;
    this.tab = 'report';
  }

  callbackevent() {
    this.tab = 'main';
  }



  Close() {
    this.location.back();
  }



}
