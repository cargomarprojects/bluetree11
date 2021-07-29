import { Component, OnInit, Input, OnDestroy, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GlobalService } from '../../core/services/global.service';
import { SearchQuery, Table_Cargo_RemarksModel, Table_Cargo_Remarks } from '../models/table_cargo_remarks';
import { PageQuery } from '../../shared/models/pageQuery';
import { PreSetMsgService } from '../services/presetmsg.service';

@Component({
    selector: 'app-presetmsg',
    templateUrl: './presetmsg.component.html'
})
export class PreSetMsgComponent implements OnInit {

    /*
    Ajith
   */

    errorMessage$: Observable<string>;
    records$: Observable<Table_Cargo_Remarks[]>;
    pageQuery$: Observable<PageQuery>;
    searchQuery$: Observable<SearchQuery>;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainservice: PreSetMsgService
    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
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
            appid:this.gs.appid,
            menuid: this.mainservice.menuid,
            pkid: '',
            type: this.mainservice.param_type,
            origin: 'presetmsg-page',
            mode: 'ADD'
        };
        this.gs.Naviagete('Silver.Other.Trans/SystemMessageEditPage', JSON.stringify(parameter));

    }
    edit(_record: Table_Cargo_Remarks) {
        if (!this.mainservice.canEdit) {
            alert('Insufficient User Rights')
            return;
        }

        let parameter = {
            appid: this.gs.appid,
            menuid: this.mainservice.menuid,
            pkid: _record.pkid,
            type: '',
            origin: 'presetmsg-page',
            mode: 'EDIT'
        };
        this.gs.Naviagete('Silver.Other.Trans/SystemMessageEditPage', JSON.stringify(parameter));
    }

    getRouteDet(_type: string, _mode: string, _record: Table_Cargo_Remarks = null) {

        if (_type == "L") {
            if ((_mode == "ADD" && this.mainservice.canAdd) || (_mode == "EDIT" && this.mainservice.canEdit))
                return "/Silver.Other.Trans/SystemMessageEditPage";
            else
                return null;
        } else if (_type == "P") {

            if (_record == null) {
                if (!this.mainservice.canAdd)
                    return null;
                return {
                    appid: this.gs.appid,
                    menuid: this.mainservice.menuid,
                    pkid: '',
                    type: this.mainservice.param_type,
                    origin: 'presetmsg-page',
                    mode: 'ADD'
                };
            }
            if (!this.mainservice.canEdit)
                return null;
            return {
                appid: this.gs.appid,
                menuid: this.mainservice.menuid,
                pkid: _record.pkid,
                type: '',
                origin: 'presetmsg-page',
                mode: 'EDIT'
            };
        } else
            return null;
    }
    
    Close() {
        this.location.back();
    }


}
