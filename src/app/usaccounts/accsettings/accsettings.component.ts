import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_acc_acctm } from '../models/tbl_acc_acctm';
import { SearchQuery } from '../models/tbl_acc_acctm';
import { PageQuery } from '../../shared/models/pageQuery';

import { AccSettingsService } from '../services/accsettings.service';

@Component({
  selector: 'app-accsettings',
  templateUrl: './accsettings.component.html'
})
export class AccSettingsComponent implements OnInit {

  /*
   Joy
 */

errorMessage$ : Observable<string> ;
records$ :  Observable<Tbl_acc_acctm[]>;
pageQuery$ : Observable<PageQuery>;
searchQuery$ : Observable<SearchQuery>;

constructor(
  private route: ActivatedRoute,
  private location: Location,
  public gs: GlobalService,
  public mainservice: AccSettingsService
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
  this.mainservice.Search(actions,  'SEARCH');
}

pageEvents(actions: any) {
  this.mainservice.Search(actions,'PAGE');
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
    origin: 'accsettings-page',
    mode: 'ADD'
  };
  this.gs.Naviagete('Silver.USAccounts.Master/AccSettingsEditPage', JSON.stringify(parameter));

}
edit(_record: Tbl_acc_acctm) {
  if (!this.mainservice.canEdit) {
    alert('Insufficient User Rights')
    return;
  }

  let parameter = {
    menuid: this.mainservice.menuid,
    pkid: _record.acc_pkid,
    type: '',
    origin: 'accsettings-page',
    mode: 'EDIT'
  };
  this.gs.Naviagete('Silver.USAccounts.Master/AccSettingsEditPage', JSON.stringify(parameter));
}

Close() {
  this.location.back();
}


}
