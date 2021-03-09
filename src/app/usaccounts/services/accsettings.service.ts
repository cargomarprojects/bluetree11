import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_acc_acctm, AcctmModel } from '../models/tbl_acc_acctm';
import { SearchQuery } from '../models/tbl_acc_acctm';
import { PageQuery } from '../../shared/models/pageQuery';
import { AccSettingsEditComponent } from '../accsettings/accsettings-edit.component';

@Injectable({
    providedIn: 'root'
})
export class AccSettingsService {

    private mdata$ = new BehaviorSubject<AcctmModel>(null);
    get data$(): Observable<AcctmModel> {
        return this.mdata$.asObservable();
    }
    private record: AcctmModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private LSESSION = 0;

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any) {
        if (this.LSESSION < this.gs.GSESSION)
        {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <AcctmModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', showonlysettings : 'Y'},
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        
        var SearchData = {...this.gs.UserInfo };

        //var SearchData = this.gs.UserInfo;

        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.CODE = this.record.searchQuery.searchString;
        if ( this.record.searchQuery.showonlysettings == 'Y')
            SearchData.SHOW_ONLY_SETTINGS = this.record.searchQuery.showonlysettings;

        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;

        if (type == 'PAGE') {
            SearchData.action = this.record.pageQuery.action;
            SearchData.page_count = this.record.pageQuery.page_count;
            SearchData.page_rows = this.record.pageQuery.page_rows;
            SearchData.page_current = this.record.pageQuery.page_current;;
        }

        this.List(SearchData).subscribe(response => {
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record = <AcctmModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RefreshList(_rec: Tbl_acc_acctm) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.acc_pkid == _rec.acc_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.acc_code = _rec.acc_code;
            REC.acc_name = _rec.acc_name;
            REC.acc_group_name = _rec.acc_group_name;
            REC.acc_type = _rec.acc_type;
            REC.rec_closed = _rec.rec_closed;
            REC.rec_created_by = _rec.rec_created_by;
        }
    }
    
    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Acctm/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Acctm/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Acctm/AcctmSettingsSave', SearchData, this.gs.headerparam2('authorized'));
    }


}
