import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_mast_files, ImportHblPageModel } from '../models/tbl_mast_files';
import { SearchQuery } from '../models/tbl_mast_files';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class ImportHblPageService {

    private mdata$ = new BehaviorSubject<ImportHblPageModel>(null);
    get data$(): Observable<ImportHblPageModel> {
        return this.mdata$.asObservable();
    }
    private record: ImportHblPageModel;

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

    private ProcessXML: boolean = false;
    public Xml_MainRecIndex: number = 0;
    public Xml_MainRecTot: number = 0;
    public Xml_Rec: Tbl_mast_files = <Tbl_mast_files>{};

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit()
    {
        this.record = <ImportHblPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', rdbprocessed: 'NOT-PROCESSED' },
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

        this.record = <ImportHblPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', rdbprocessed: 'NOT-PROCESSED' },
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
        if (this.gs.isBlank(this.record.searchQuery.rdbprocessed))
            SearchData.FLAG = 'N';
        else
            SearchData.FLAG = this.record.searchQuery.rdbprocessed == 'PROCESSED' ? 'Y' : 'N';
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
            this.ProcessXML = false;
            if (this.ProcessXML) {
                this.ProcessXML = false;
                this.Xml_MainRecIndex = 0;

                this.Xml_MainRecTot = 0;
                if (!this.gs.isBlank(this.record.records))
                    this.Xml_MainRecTot = this.record.records.length;

                if (this.Xml_MainRecTot > 0) {
                    this.ImportMultipleXmlFiles();
                }
            }

        }, error => {
            this.record = <ImportHblPageModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    ImportMultipleXmlFiles() {
        if (this.Xml_MainRecIndex < this.Xml_MainRecTot) {
            this.Xml_Rec = this.record.records[this.Xml_MainRecIndex++];
            if (this.Xml_Rec.files_processed != "Y")
                this.ImportXmlData();
        }
    }



    ImportXmlData() {
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.FILES_SLNO = this.Xml_Rec.files_slno.toString();
        SearchData.FILES_ID = this.Xml_Rec.files_id;
        SearchData.FILES_TYPE = this.Xml_Rec.files_type;
        SearchData.FILES_DESC = this.Xml_Rec.files_desc;
        SearchData.FILES_ROOT = this.gs.FS_APP_FOLDER;
        SearchData.FILES_PATH = this.Xml_Rec.files_path;
        SearchData.FILES_REF_NO = this.Xml_Rec.files_ref_no;
        this.ImportXmlFileData(SearchData)
            .subscribe(response => {
                this.Xml_Rec.files_processed = response.IsFileProcessed;
                if (this.record.records != null) {
                    var REC = this.record.records.find(rec => rec.files_id == this.Xml_Rec.files_id);
                    if (REC != null)
                        REC.files_processed = this.Xml_Rec.files_processed;
                }
                this.ImportMultipleXmlFiles();
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    ProcessFtp() {
        this.ProcessXML = false;
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.APP_FOLDER = this.gs.FS_APP_FOLDER;
        SearchData.FTP_FOLDER = this.gs.GLOBAL_FTP_FOLDER;
        this.ProcessXmlFile(SearchData)
            .subscribe(response => {

                this.ProcessXML = true;
                this.record = <ImportHblPageModel>{
                    errormessage: '',
                    records: [],
                    searchQuery: <SearchQuery>{ searchString: '', rdbprocessed: 'NOT-PROCESSED' },
                    pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
                };
                this.mdata$.next(this.record);
                this.Search(this.record, 'SEARCH');
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/importhblpage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    ImportXmlFileData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/importhblpage/ImportXmlFileData', SearchData, this.gs.headerparam2('authorized'));
    }

    ProcessXmlFile(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/importhblpage/ProcessXmlFile', SearchData, this.gs.headerparam2('authorized'));
    }

}
