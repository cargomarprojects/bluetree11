import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Addr_Catgory, Tbl_Cargo_BulkMail } from '../models/Tbl_Addr_Catgory';

import { BulkmailService } from '../services/bulkmail.service';
import { SearchQuery } from '../models/Tbl_Addr_Catgory';
import { PageQuery } from '../../shared/models/pageQuery';
declare var $: any;

@Component({
  selector: 'app-bulkmail',
  templateUrl: './bulkmail.component.html'
})
export class BulkmailComponent implements OnInit {

  // 26-11-2021 Created By Ajith  
  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Addr_Catgory[]>;
  recordsoth$: Observable<Tbl_Addr_Catgory[]>;
  records2$: Observable<Tbl_Cargo_BulkMail[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public gs: GlobalService,
    public mainservice: BulkmailService
  ) { }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.mainservice.init(this.route.snapshot.queryParams);
    this.initPage();
  }

  initPage() {

    this.records$ = this.mainservice.data$.pipe(map(res => res.records));
    this.recordsoth$ = this.mainservice.data$.pipe(map(res => res.recordsoth));
    this.records2$ = this.mainservice.data$.pipe(map(res => res.records2));
    this.searchQuery$ = this.mainservice.data$.pipe(map(res => res.searchQuery));
    this.pageQuery$ = this.mainservice.data$.pipe(map(res => res.pageQuery));
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
  }

  List(actions: any) {
    this.mainservice.Search(actions, 'SEARCH');
  }

  pageEvents(actions: any) {
    this.mainservice.Search(actions, 'PAGE');
  }

  onBlur(_feild: string) {

  }

  Close() {
    this.location.back();
  }

  Valid_Click() {
    this.getActiveTabID();
    if (this.mainservice.activeTabId.toUpperCase() == "OTHERS") {
      if (!this.mainservice.IstypeSelect()) {
        alert("Type not selected");
        return;
      }
    } else {
      if (!this.mainservice.IscatgorySelect()) {
        alert("Client Category not selected");
        return;
      }
    }

    this.mainservice.CreateMails("VALIDATION");
  }

  CreateMails() {
    this.getActiveTabID();
    this.mainservice.CreateMails('MAIL');
  }

  getActiveTabID() {
    var $activeTab = $('.tab-content .tab-pane.active');
    var activeId = $activeTab.attr('id');
    if (activeId == 'default')
      this.mainservice.activeTabId = 'DEFAULT';
    if (activeId == 'others')
      this.mainservice.activeTabId = 'OTHERS';
    
      // $('.nav-tabs a').on('shown.bs.tab', function(e){
    //   var x = $(e.target).text();         // active tab
    //   var y = $(e.relatedTarget).text();  // previous tab
    //   $(".act span").text(x);
    //   $(".prev span").text(y);
    //   alert(x);
    // });


    alert(this.mainservice.activeTabId)
  }

}
