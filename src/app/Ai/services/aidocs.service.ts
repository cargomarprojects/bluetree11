import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { vm_Tbl_Mast_Filesm, Mast_Filesm_Model, Tbl_Mast_Filesm } from '../models/Tbl_mast_filesm';
import { SearchQuery } from '../models/Tbl_mast_filesm';
import { PageQuery } from '../../shared/models/pageQuery';



@Injectable({
    providedIn: 'root'
})
export class AiDocsService {

    private mdata$ = new BehaviorSubject<Mast_Filesm_Model>(null);
    get data$(): Observable<Mast_Filesm_Model> {
        return this.mdata$.asObservable();
    }
    private record: Mast_Filesm_Model;

    public id: string;
    public menuid: string;
    public file_type: string = 'AI-BL';

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;

    public initlialized: boolean;
    private appid = '';

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public selectRowId(rec: Tbl_Mast_Filesm) {
        this.record.selectedId = rec.file_pkid;
        this.record.selectedSlNo = rec.file_slno;
    }
    public getRowId() {
        return this.record.selectedId;
    }

    public getRowSlNo() {
        return this.record.selectedSlNo;
    }


    public ClearInit() {
        this.record = <Mast_Filesm_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', file_type: this.file_type },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }

    public init(params: any) {
        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.id = params.id;
        this.menuid = params.id;
        //this.file_type = params.param_type;

        this.record = <Mast_Filesm_Model>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', file_type: this.file_type },
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

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = this.file_type;
        SearchData.page_rowcount = 10;
        SearchData.CODE = this.record.searchQuery.searchString;
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
            this.record.selectedId = null;
            this.record.selectedSlNo = null;
            this.record.records = response.list;
            this.record.DocList = [];
            this.mdata$.next(this.record);
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    RefreshList(_rec: Tbl_Mast_Filesm) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.file_pkid == _rec.file_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.file_remarks = _rec.file_remarks;
            REC.file_slno = _rec.file_slno;
            REC.rec_files_attached = _rec.rec_files_attached;
            REC.rec_created_by = _rec.rec_created_by;
        }
    }

    ShowDocumentList(_docID: string) {
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _docID;
        this._ShowDocumentList(SearchData).subscribe(response => {
            this.record.DocList = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.record.DocList = [];
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    private List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiDocs/List', SearchData, this.gs.headerparam2('authorized'));
    }

    private _ShowDocumentList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiDocs/GetDocList', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiDocs/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiDocs/Save', SearchData, this.gs.headerparam2('authorized'));
    }


    GetDocumentRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAiVerify/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    TransferAiData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/SeaImport/TransferData/TransferAiData', SearchData, this.gs.headerparam2('authorized'));
    }
}
