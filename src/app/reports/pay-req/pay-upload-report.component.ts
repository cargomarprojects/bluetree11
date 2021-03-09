import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../models/Tbl_cargo_invoicem';
import { Tbl_cargo_general } from '../../other/models/tbl_cargo_general'
import { ReportService } from '../services/report.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pay-upload-report',
  templateUrl: './pay-upload-report.component.html'
})
export class PayUploadReportComponent implements OnInit {

  // 15-07-2019 Created By Ajith  
  @Input() public pkid: string;
  @Input() public menuid: string;
  @Input() public type: string;
  @Input() public title: string='';
  @Input() public HouseList: Tbl_cargo_general[];
  @Input() public InvoiceList: Tbl_cargo_invoicem[];
 
  isAdmin: boolean;
  errorMessage: string;
  attach_title: string = '';
  attach_parentid: string = '';
  attach_refno: string = '';
  attach_type: string = '';
  attach_typelist: any = {};
  attach_tablename: string = '';
  attach_tablepkcolumn: string = '';
  attach_customername:string='';
   
  modal: any;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    private mainService: ReportService
  ) { 
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
    this.isAdmin = this.gs.IsAdmin(this.menuid);
    this.errorMessage = '';
    this.LoadCombo();
  }

  LoadCombo() {

  }

  actionHandler() {
    
  }

  init() {
  }

   

  OnChange(field: string) {

  }

  onBlur(field: string) {
    switch (field) {
      // case 'remarks': {
      //   this.record.remarks = this.record.remarks.toUpperCase();
      //   break;
      // }
    }
  }


  Save() {

    if (!this.Allvalid())
      return;
 
  }

  Allvalid(): boolean {

    var bRet = true;
    return bRet;
  }


  AttachRowHouse(_rec: Tbl_cargo_general, payattachmodal: any) {
   
    let TypeList: any[] = [];
    this.attach_title = "File Uploaded";
    this.attach_parentid = _rec.hbl_pkid;
    this.attach_type = "OHBL OR TELEX RLS";
    this.attach_typelist = TypeList;
    this.attach_tablename = "cargo_housem";
    this.attach_tablepkcolumn = "hbl_pkid"
    this.attach_refno = _rec.hbl_houseno;
    this.attach_customername="";
    this.modal = this.modalservice.open(payattachmodal, { centered: true });

  }

  AttachRowInvoice(_rec: Tbl_cargo_invoicem, payattachmodal: any) {
    let TypeList: any[] = [];
    TypeList = [{ "code": "CHECK COPY", "name": "CHECK COPY" }];
    this.attach_title = "File Uploaded";
    this.attach_parentid = _rec.inv_pkid;
    this.attach_type = "CHECK COPY";
    this.attach_typelist = TypeList;
    this.attach_tablename = "cargo_invoicem";
    this.attach_tablepkcolumn = "inv_pkid"
    this.attach_refno = _rec.inv_no;
    this.attach_customername = _rec.inv_name;
    this.modal = this.modalservice.open(payattachmodal, { centered: true });
  }


  BtnNavigation(action: string) {
    switch (action) {
        // case 'HISTORY': {
        //     let prm = {
        //         menuid: this.menuid,
        //         pkid: this.pkid,
        //         source: this.source,
        //         title: "History [" + this.source + "]",
        //         origin: 'Xml-remark-page'
        //     };
        //     this.gs.Naviagete('Silver.BusinessModule/LogBookPage', JSON.stringify(prm));
        //     break;
        // }
    }
}

  Close() {
    this.location.back();
  }
  CloseModal() {
    this.modal.close();
  }
}
