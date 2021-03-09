import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_invoicem } from '../../reports/models/Tbl_cargo_invoicem';

@Component({
  selector: 'app-genlist',
  templateUrl: './genlist.component.html'
})
export class GenListComponent implements OnInit {
  // 15-07-2019 Created By Ajith  
  @Input() public title: string=''; 
  @Input() public type: string='';
  @Input() public InvoiceList: Tbl_cargo_invoicem[];
 
  errorMessage: string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService
  ) { 
  }

  ngOnInit() {
    this.initPage();
    this.actionHandler();
  }

  private initPage() {
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
}
