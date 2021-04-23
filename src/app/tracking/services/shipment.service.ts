
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { cargo_masterm, ShipmentModel  } from '../models/cargo_masterm';
import { SearchQuery } from '../models/cargo_masterm';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class ShipmentService {

    private mdata$ = new BehaviorSubject<ShipmentModel>(null);
    get data$(): Observable<ShipmentModel> {
        return this.mdata$.asObservable();
    }
    private record: ShipmentModel;

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
    private appid =''
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public getSortCol(){
        return this.record.sortcol;
    }
    public getSortOrder(){
        return this.record.sortorder;
    }

    public getIcon(col : string){
        if ( col == this.record.sortcol){
          if ( this.record.sortorder )
            return 'fa fa-arrow-down';
          else 
            return 'fa fa-arrow-up';
        }
        else 
          return null;
    }
    
    public  sort(col : string){
        if ( col == this.record.sortcol){
          this.record.sortorder = !this.record.sortorder;
        }
        else 
        {
          this.record.sortcol = col;
          this.record.sortorder = true;
        }
    }
     
    public ClearInit() {
        this.record = <ShipmentModel>{
            sortcol : 'mbl_refno',
            sortorder : true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF_30), todate: this.gs.defaultValues.today, refno : '',mode : 'ALL', sortcolumn :'REF-DATE' },
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
        this.param_type = params.menu_param;
        this.record = <ShipmentModel>{
            sortcol : 'mbl_refno',
            sortorder : true,       
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF_30), todate: this.gs.defaultValues.today, refno : '',mode : 'ALL' , sortcolumn :'REF-DATE'},
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };

        //this.gs.defaultValues.lastmonthdate
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
        SearchData.CODE = this.record.searchQuery.searchString;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.REFNO = this.record.searchQuery.refno;
        SearchData.MODE = this.record.searchQuery.mode;
        SearchData.SORTCOLUMN = this.record.searchQuery.sortcolumn;
        SearchData.OVERRIDE_POD_ETA = this.gs.SEA_IMP_OVERRIDE_POD_ETA;
        
        SearchData.USER_CATEGORY = this.gs.User_Category;
        SearchData.USER_ROLE = this.gs.User_Role;
        SearchData.USER_ISPARENT = this.gs.User_isParent;
        SearchData.USER_CUSTOMER_ID = this.gs.User_Customer_Id;
        SearchData.USER_PARENT_ID = this.gs.User_Customer_Parent_Id;
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;

        if (type == 'PAGE') {
            SearchData.action = this.record.pageQuery.action;
            SearchData.page_count = this.record.pageQuery.page_count;
            SearchData.page_rows = this.record.pageQuery.page_rows;
            SearchData.page_current = this.record.pageQuery.page_current;
        }

        this.List(SearchData).subscribe(response => {
            this.record.pageQuery = <PageQuery>{ action: 'NEW', page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            
            // this.record = <ShipmentModel>{
            //     records: [],
            //     errormessage: this.gs.getError(error),
            // }

            this.record = {...this.record, errormessage: this.gs.getError(error) };

            this.mdata$.next(this.record);
        });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ShipmentTracking/List', SearchData, this.gs.headerparam2('authorized'));
    }


}
