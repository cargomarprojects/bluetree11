
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Table_User_Edit_History, UserEditHistoryModel } from '../models/table_user_edit_history';
import { SearchQuery } from '../models/table_user_edit_history';
import { PageQuery } from '../models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class EditHistoryService {

    private mdata$ = new BehaviorSubject<UserEditHistoryModel>(null);
    get data$(): Observable<UserEditHistoryModel> {
        return this.mdata$.asObservable();
    }
    private record: UserEditHistoryModel;

    public id: string;
    public parentid: string;

    public initlialized: boolean;
    private appid = '';
    modal: any;
    constructor(
        private modalconfig: NgbModalConfig,
        private modalservice: NgbModal,
        private http2: HttpClient,
        private gs: GlobalService
    ) {
        modalconfig.backdrop = 'static'; //true/false/static
        modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
    }

    public selectRowId(id: string) {
        this.record.selectedId = id;
    }
    public getRowId() {
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

    public init(params: any) {
        if (this.appid != this.gs.appid) {
            this.appid = this.gs.appid;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        // this.id = params.id;
        // this.menuid = params.id;
        // this.param_type = params.param_type;

        this.record = <UserEditHistoryModel>{
            selectedId: '',
            sortcol: '',
            sortorder: true,
            errormessage: '',
            records: [],
            records2: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: '', todate: '' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }


    Search(_searchdata: any, type: string = '', _modal: any = null) {

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
        SearchData.pkid =  this.gs.getGuid();
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;
        SearchData.PARENT_ID = this.parentid;

        if (type == 'PAGE') {
            SearchData.action = this.record.pageQuery.action;
            SearchData.page_count = this.record.pageQuery.page_count;
            SearchData.page_rows = this.record.pageQuery.page_rows;
            SearchData.page_current = this.record.pageQuery.page_current;;
        }

        this.List(SearchData).subscribe(response => {
            this.record.records = response.list;
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.mdata$.next(this.record);
            if (type == 'SEARCH')
                this.modal = this.modalservice.open(_modal, { centered: true });
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    CloseModal(_type: string) {

        // if (this.callbackevent)
        //   this.callbackevent.emit({ action: _type});
        this.modal.close();
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/EditHistory/List', SearchData, this.gs.headerparam2('authorized'));
    }

}
