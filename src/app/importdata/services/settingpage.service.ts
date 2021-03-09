import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_edi_link, SettingPageModel } from '../models/tbl_edi_link';
import { SearchQuery } from '../models/tbl_edi_link';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class SettingPageService {

    private mdata$ = new BehaviorSubject<SettingPageModel>(null);
    get data$(): Observable<SettingPageModel> {
        return this.mdata$.asObservable();
    }
    private record: SettingPageModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private LSESSION = 0;

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit()
    {
        this.record = <SettingPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }

    public init(params: any) {
        if (this.LSESSION < this.gs.GSESSION) {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <SettingPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {
        this.record.errormessage = '';
        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
        }
        if (type == 'PAGE') {
            this.record.pageQuery = _searchdata.pageQuery;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        if (this.gs.isBlank(this.record.searchQuery.searchString))
            SearchData.SEARCHSTRING = '';
        else
            SearchData.SEARCHSTRING = this.record.searchQuery.searchString;
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
            this.record = <SettingPageModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    RemoveRow(_rec: Tbl_edi_link) {

        if (!confirm("Remove Selected Record")) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.link_pkid;
        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.link_pkid == _rec.link_pkid), 1);
                }
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    // DeleteRow(_rec: Tbl_cargo_exp_housem) {

    //     if (this.gs.isBlank(_rec.hbl_pkid) || this.gs.isBlank(_rec.hbl_mbl_id)) {
    //         this.record.errormessage = "Cannot Delete, Reference Not Found";
    //         alert(this.record.errormessage);
    //         this.mdata$.next(this.record);
    //         return;
    //     }

    //     if (!confirm("DELETE " + _rec.hbl_houseno)) {
    //         return;
    //     }

    //     this.record.errormessage = '';
    //     var SearchData = this.gs.UserInfo;
    //     SearchData.pkid = _rec.hbl_pkid;
    //     SearchData.mblid = _rec.hbl_mbl_id;
    //     SearchData.remarks = _rec.hbl_houseno;

    //     this.DeleteRecord(SearchData)
    //         .subscribe(response => {
    //             if (response.retvalue == false) {
    //                 this.record.errormessage = response.error;
    //                 alert(this.record.errormessage);
    //             }
    //             else {
    //                 this.record.records.splice(this.record.records.findIndex(rec => rec.hbl_pkid == _rec.hbl_pkid), 1);
    //             }
    //             this.mdata$.next(this.record);
    //         }, error => {
    //             this.record.errormessage = this.gs.getError(error);
    //             alert(this.record.errormessage);
    //             this.mdata$.next(this.record);
    //         });
    // }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/settingpage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/settingpage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    // GetRecord(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    // }

    // Isblnoduplication(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/Isblnoduplication', SearchData, this.gs.headerparam2('authorized'));
    // }

    // Save(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/Save', SearchData, this.gs.headerparam2('authorized'));
    // }

    // LoadMasterData(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/LoadMasterData', SearchData, this.gs.headerparam2('authorized'));
    // }

    // DeleteRecord(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/AirExport/House/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    // }

}
