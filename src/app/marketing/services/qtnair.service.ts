import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_Cargo_Qtnd_Air, QtnmModel, vm_Tbl_Cargo_Qtnd_Air, Tbl_Cargo_Qtnm } from '../models/tbl_cargo_qtnm';
import { SearchQuery } from '../models/tbl_cargo_qtnm';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class QtnAirService {

    private mdata$ = new BehaviorSubject<QtnmModel>(null);
    get data$(): Observable<QtnmModel> {
        return this.mdata$.asObservable();
    }
    private record: QtnmModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;
    public canPrint: boolean;

    public initlialized: boolean;
    private appid = ''

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public selectRowId( id : string){
        this.record.selectedId = id;
    }
    public getRowId(){
        return this.record.selectedId;
    }


    public getSortCol() {
        return this.record.sortcol;
    }
    public getSortOrder() {
        return this.record.sortorder;
    }

    public getIcon(col: string) {
        if (col == this.record.sortcol) {
            if (this.record.sortorder)
                return 'fa fa-arrow-down';
            else
                return 'fa fa-arrow-up';
        }
        else
            return null;
    }

    public sort(col: string) {
        if (col == this.record.sortcol) {
            this.record.sortorder = !this.record.sortorder;
        }
        else {
            this.record.sortcol = col;
            this.record.sortorder = true;
        }
    }
    public ClearInit() {
        this.record = <QtnmModel>{
            selectedId : '',
            sortcol: 'qtnm_no',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, searchtype: 'Quote To / Quote #' },
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
        this.param_type = params.param_type;

        this.record = <QtnmModel>{
            selectedId : '',            
            sortcol: 'qtnm_no',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, searchtype: 'Quote To / Quote #' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);
        this.canPrint = this.gs.canPrint(this.menuid);

        this.initlialized = true;

    }

    Search(_searchdata: any, type: string = '') {

        if (type == 'SEARCH') {
            this.record.searchQuery = _searchdata.searchQuery;
            this.record.selectedId = '';
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
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.STYPE = 'AIR';
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
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    RefreshList(_rec: Tbl_Cargo_Qtnm) {
        if (this.gs.isBlank(this.record))
            return;

        if (this.gs.isBlank(this.record.records))
            return;
        var REC = this.record.records.find(rec => rec.qtnm_pkid == _rec.qtnm_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {

            REC.qtnm_date = _rec.qtnm_date;
            REC.qtnm_to_name = _rec.qtnm_to_name;
            REC.qtnm_quot_by = _rec.qtnm_quot_by;
            REC.qtnm_pol_name = _rec.qtnm_pol_name;
            REC.qtnm_pod_name = _rec.qtnm_pod_name;
            REC.qtnm_move_type = _rec.qtnm_move_type;
            REC.qtnm_commodity = _rec.qtnm_commodity;
        }
    }

    DeleteRow(_rec: Tbl_Cargo_Qtnm) {

        this.record.errormessage = '';
        if (!confirm("DELETE " + _rec.qtnm_no)) {
            return;
        }

        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.qtnm_pkid;
        SearchData.remarks = _rec.qtnm_no;

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.qtnm_pkid == _rec.qtnm_pkid), 1);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnAir/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnAir/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnAir/Save', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnAir/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
    GetMessage(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnLcl/GetMessage', SearchData, this.gs.headerparam2('authorized'));
    }
    GetContactMemo(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnAir/GetContactMemo', SearchData, this.gs.headerparam2('authorized'));
    }
    LoadLabelHeader(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnAir/LoadLabelHeader', SearchData, this.gs.headerparam2('authorized'));
    }

}
