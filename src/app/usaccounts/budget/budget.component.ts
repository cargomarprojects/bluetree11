import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_Budgetm, Tbl_Budgetd } from '../models/tbl_budget';
import { SearchQuery } from '../models/tbl_budget';
import { PageQuery } from '../../shared/models/pageQuery';

import { BudgetService } from '../services/budget.service';

@Component({
    selector: 'app-budget',
    templateUrl: './budget.component.html'
})
export class BudgetComponent implements OnInit {

    /*
     Joy
   */

    errorMessage$: Observable<string>;
    records$: Observable<Tbl_Budgetm[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: BudgetService
    ) { }

    ngOnInit() {
        this.mainservice.init(this.route.snapshot.queryParams);
        this.initPage();

        var search = <SearchQuery>{};
        search.searchString  ='';
        this.mainservice.Search(search,  'SEARCH');
    }

    initPage() {
        this.records$ = this.mainservice.data$.pipe(map(res => res.records));
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
            type: this.mainservice.param_type,
            origin: 'budget-page',
            mode: 'ADD'
        };
        this.gs.Naviagete('Silver.USAccounts.Master/BudgetEditPage', JSON.stringify(parameter));
    }

    edit(_record: Tbl_Budgetm) {
        if (!this.mainservice.canEdit) {
            alert('Insufficient User Rights')
            return;
        }
        let parameter = {
            menuid: this.mainservice.menuid,
            pkid: _record.bm_pkid,
            type: '',
            origin: 'budget-page',
            mode: 'EDIT'
        };
        this.gs.Naviagete('Silver.USAccounts.Master/BudgetEditPage', JSON.stringify(parameter));
    }

    Close() {
        this.location.back();
    }

}
