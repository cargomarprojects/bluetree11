import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Addr_Catgory } from '../models/Tbl_Addr_Catgory';

import { BulkmailService } from '../services/bulkmail.service';

@Component({
  selector: 'app-bulkmail',
  templateUrl: './bulkmail.component.html'
})
export class BulkmailComponent implements OnInit {

  // 26-11-2021 Created By Ajith  
  errorMessage$: Observable<string>;
  records$: Observable<Tbl_Addr_Catgory[]>;

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
    this.errorMessage$ = this.mainservice.data$.pipe(map(res => res.errormessage));
  }


  Close() {
    this.location.back();
  }
  

}
