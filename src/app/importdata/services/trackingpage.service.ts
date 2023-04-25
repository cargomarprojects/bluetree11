import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_edi_isa, TrackingPageModel } from '../models/tbl_edi_isa';
import { SearchQuery } from '../models/tbl_mast_files';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class TrackingPageService {

    private mdata$ = new BehaviorSubject<TrackingPageModel>(null);
    get data$(): Observable<TrackingPageModel> {
        return this.mdata$.asObservable();
    }
    private record: TrackingPageModel;

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
    private appid = '';

    private ProcessXML: boolean = false;
    public Xml_MainRecIndex: number = 0;
    public Xml_MainRecTot: number = 0;
    public Xml_Rec: Tbl_edi_isa = <Tbl_edi_isa>{};

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

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
        this.record = <TrackingPageModel>{
            sortcol: 'files_desc',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', rdtrkprocessed: 'NOT-PROCESSED' },
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

        this.record = <TrackingPageModel>{
            sortcol: 'files_desc',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', rdtrkprocessed: 'NOT-PROCESSED' },
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
            SearchData.CODE = '';
        else
            SearchData.CODE = this.record.searchQuery.searchString;
        if (this.gs.isBlank(this.record.searchQuery.rdtrkprocessed))
            SearchData.FLAG = 'N';
        else
            SearchData.FLAG = this.record.searchQuery.rdtrkprocessed == 'PROCESSED' ? 'Y' : 'N';
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
              this.ProcessXML = false; // ProcessXML set to true in ProcessFtp() inorder to invoke automatic ImportXmlData
            if (this.ProcessXML) {
                this.ProcessXML = false;
                this.Xml_MainRecIndex = 0;

                this.Xml_MainRecTot = 0;
                if (!this.gs.isBlank(this.record.records))
                    this.Xml_MainRecTot = this.record.records.length;

                if (this.Xml_MainRecTot > 0) {
                    this.ImportMultipleFiles();
                }
            }

        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    ImportMultipleFiles() {
        if (this.Xml_MainRecIndex < this.Xml_MainRecTot) {
            this.Xml_Rec = this.record.records[this.Xml_MainRecIndex++];
            if (this.Xml_Rec.isa_files_processed != "Y")
                this.ImportTrackingData();
        }
    }



    ImportTrackingData() {
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.ISA_PKID = this.Xml_Rec.isa_pkid;
        SearchData.FILES_SLNO = this.Xml_Rec.isa_files_slno.toString();
        SearchData.FILES_ID = this.Xml_Rec.isa_files_id;
        SearchData.FILES_TYPE = this.Xml_Rec.isa_files_type;
        SearchData.FILES_DESC = this.Xml_Rec.isa_files_desc;
        SearchData.FILES_ROOT = this.gs.FS_APP_FOLDER;
        SearchData.FILES_PATH = this.Xml_Rec.isa_files_path;
        SearchData.GRP_FORMAT = this.Xml_Rec.grp_format;
        this.ImportTrackingFileData(SearchData)
            .subscribe(response => {
                this.Xml_Rec.isa_files_processed = response.IsFileProcessed;
                if (this.record.records != null) {
                    var REC = this.record.records.find(rec => rec.isa_pkid == this.Xml_Rec.isa_pkid);
                    if (REC != null)
                        REC.isa_files_processed = this.Xml_Rec.isa_files_processed;
                }
                this.ImportMultipleFiles();
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                this.mdata$.next(this.record);
                alert(this.record.errormessage);
            });
    }

    ProcessTracking() {
        this.ProcessXML = false;
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.APP_FOLDER = this.gs.FS_APP_FOLDER;
        SearchData.FTP_FOLDER = this.gs.GLOBAL_FTP_FOLDER;
        this.ProcessTrackingFile(SearchData)
            .subscribe(response => {

                this.ProcessXML = true;
                this.record = <TrackingPageModel>{
                    errormessage: '',
                    records: [],
                    searchQuery: <SearchQuery>{ searchString: '', rdbprocessed: 'NOT-PROCESSED' },
                    pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
                };
                this.mdata$.next(this.record);
                this.Search(this.record, 'SEARCH');
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                this.mdata$.next(this.record);
                alert(this.record.errormessage);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/trackingpage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    ImportTrackingFileData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/trackingpage/ImportTrackingFileData', SearchData, this.gs.headerparam2('authorized'));
    }

    ProcessTrackingFile(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/trackingpage/ProcessTrackingFile', SearchData, this.gs.headerparam2('authorized'));
    }

}
