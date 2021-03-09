import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_edi_link, LinkPageModel, vm_tbl_edi_link } from '../models/tbl_edi_link';
import { SearchQuery } from '../models/tbl_edi_link';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class LinkPageService {

    private mdata$ = new BehaviorSubject<LinkPageModel>(null);
    get data$(): Observable<LinkPageModel> {
        return this.mdata$.asObservable();
    }
    public record: LinkPageModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;
    public canSearch: boolean;

    public initlialized: boolean;
    
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public init(params: any, _rec: Tbl_edi_link) {
    
        // if (this.initlialized)
        //     return;

        // this.id = params.id;
        // this.menuid = params.id;
        // this.param_type = params.param_type;

        this.canSearch = true;
        if (_rec.link_category == "CUSTOM")
            this.canSearch = false;

        this.record = <LinkPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: this.canSearch == true ? _rec.link_source_name : "", messageSender: _rec.link_messagesender, category: _rec.link_category, subcategory: _rec.link_subcategory, sourceName: _rec.link_source_name },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        this.mdata$.next(this.record);

        // this.isAdmin = this.gs.IsAdmin(this.menuid);
        // this.title = this.gs.getTitle(this.menuid);
        // this.canAdd = this.gs.canAdd(this.menuid);
        // this.canEdit = this.gs.canEdit(this.menuid);
        // this.canSave = this.canAdd || this.canEdit;
        // this.canDelete = this.gs.canDelete(this.menuid);

        // this.initlialized = true;

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
        SearchData.SENDER = this.record.searchQuery.messageSender;
        SearchData.CATEGORY = this.record.searchQuery.category;
        SearchData.SUBCATEGORY = this.record.searchQuery.subcategory;
        SearchData.NAME = this.record.searchQuery.searchString;
        SearchData.page_rowcount = 10;
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
            this.record = <LinkPageModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/linkpage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/linkpage/Save', SearchData, this.gs.headerparam2('authorized'));
    }
}