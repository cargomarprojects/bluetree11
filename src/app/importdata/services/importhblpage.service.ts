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
    private appid = '';

    private ProcessXML: boolean = false;
    public Xml_MainRecIndex: number = 0;
    public Xml_MainRecTot: number = 0;
    public Xml_Rec: Tbl_mast_files = <Tbl_mast_files>{};

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
        this.record = <ImportHblPageModel>{
            sortcol: 'files_slno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', rdbprocessed: 'NOT-PROCESSED', fromdate: this.gs.getPreviousDate(15), todate: this.gs.defaultValues.today },
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

        this.record = <ImportHblPageModel>{
            sortcol: 'files_slno',
            sortorder: true,
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', rdbprocessed: 'NOT-PROCESSED', fromdate: this.gs.getPreviousDate(15), todate: this.gs.defaultValues.today },
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
        SearchData.FILES_TYPE = 'XML-EDI';
        SearchData.page_count = 0;
        SearchData.page_rows = 0;
        SearchData.page_current = -1;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;

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
                this.ProcessFiles();
            }

        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    ProcessFiles() {

        this.Xml_MainRecIndex = 0;
        this.Xml_MainRecTot = 0;
        if (!this.gs.isBlank(this.record.records))
            this.Xml_MainRecTot = this.record.records.length;

        if (this.record.searchQuery.rdbprocessed == "PROCESSED") {
            alert('Please select Not Processed and Search to process Xml');
            return;
        }
        if (this.Xml_MainRecTot <= 0) {
            alert('List Not Found');
            return;
        }

        if (!confirm("Process Y/N")) {
            return;
        }

        if (this.Xml_MainRecTot > 0) {
            this.ImportMultipleXmlFiles();
        }
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
                this.mdata$.next(this.record);
                alert(this.record.errormessage);
            });
    }

    ProcessFtp() {

        if (!confirm("Download Xml Y/N")) {
            return;
        }

        this.ProcessXML = false;
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.APP_FOLDER = this.gs.FS_APP_FOLDER;
        SearchData.FTP_FOLDER = this.gs.GLOBAL_FTP_FOLDER;
        SearchData.FILES_TYPE = 'XML-EDI';
        this.ProcessXmlFile(SearchData)
            .subscribe(response => {

                this.ProcessXML = true;
                this.record = <ImportHblPageModel>{
                    errormessage: '',
                    records: [],
                    searchQuery: <SearchQuery>{ searchString: '', rdbprocessed: 'NOT-PROCESSED', fromdate: this.gs.getPreviousDate(15), todate: this.gs.defaultValues.today },
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

    DeleteXmlFile(_searchQuery: SearchQuery) {

        if (this.gs.isBlank(_searchQuery.fromdate)) {
            alert('From Date Cannot be Blank');
            return;
        }
        if (this.gs.isBlank(_searchQuery.todate)) {
            alert('To Date Cannot be Blank');
            return;
        }


        let Msg: string = "";
        Msg = "THIS WILL DELETE ALL XML FILES FROM ";
        Msg += this.gs.ConvertDate2DisplayFormat(this.record.searchQuery.fromdate) + " TO ";
        Msg += this.gs.ConvertDate2DisplayFormat(this.record.searchQuery.todate);
        if (!confirm(Msg)) {
            return;
        }

        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.APP_FOLDER = this.gs.FS_APP_FOLDER;
        SearchData.FTP_FOLDER = this.gs.GLOBAL_FTP_FOLDER;
        SearchData.FILES_TYPE = 'XML-EDI';
        SearchData.SDATE = _searchQuery.fromdate;
        SearchData.EDATE = _searchQuery.todate;
        this.DeleteFiles(SearchData)
            .subscribe(response => {
                this.record.errormessage = response.error;
                alert(this.record.errormessage);
                if (response.retvalue) {
                    this.record.records = [];
                    this.mdata$.next(this.record);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                this.mdata$.next(this.record);
                alert(this.record.errormessage);
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

    DeleteFiles(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/importhblpage/DeleteFiles', SearchData, this.gs.headerparam2('authorized'));
    }

}
