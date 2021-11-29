import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { BulkmailModel, Tbl_Addr_Catgory, Tbl_Cargo_BulkMail, vm_Tbl_Addr_Catgory } from '../models/Tbl_Addr_Catgory';
import { SearchQuery } from '../models/Tbl_Addr_Catgory';
import { PageQuery } from '../../shared/models/pageQuery';


@Injectable({
    providedIn: 'root'
})
export class BulkmailService {

    private mdata$ = new BehaviorSubject<BulkmailModel>(null);
    get data$(): Observable<BulkmailModel> {
        return this.mdata$.asObservable();
    }
    private record: BulkmailModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public fromemailid: string = "";
    public emailpassword: string = "";

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private appid = '';
    MainList: Tbl_Addr_Catgory[] = [];
    public chkall: boolean = true;
    public all: boolean = true;

    public Txt_Subject: string = "";
    public Txt_Message: string = "";
    public Txt_Error: string = "";
    public msgFontFamily: string = "";
    public msgFontSize: string = "";
    public msgForeground: string = "";
    public msgFontWeight: string = "";

    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

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


    public ClearInit() {
        this.record = <BulkmailModel>{
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

        this.record = <BulkmailModel>{
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

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);

        this.msgFontFamily = this.gs.user_email_sign_font;
        this.msgFontSize = this.gs.user_email_sign_size + "px";
        this.msgForeground = this.gs.user_email_sign_color;
        if (this.gs.user_email_sign_bold == "Y")
            this.msgFontWeight = "bold";
        else
            this.msgFontWeight = "normal";

        this.initlialized = true;
        this.LoadList();
    }

    LoadList() {

        this.MainList = new Array<Tbl_Addr_Catgory>();
        this.FillMainList("SHIPPER", "Shipper (S)");
        this.FillMainList("CONSIGNEE", "Consignee (C)");
        this.FillMainList("IMPORTER", "Importer (I)");
        this.FillMainList("EXPORTER", "Exporter (X)");
        this.FillMainList("CHA", "Customs Broker (B)");
        this.FillMainList("FORWARDER", "Domestic Forwarder (F)");
        this.FillMainList("AGENT", "Overseas Agent (A)");
        this.FillMainList("CARRIER", "Air Carrier (L)");
        this.FillMainList("CARRIER2_SEA", "Sea Carrier (R)");
        this.FillMainList("TRUCKER", "Trucker (T)");
        this.FillMainList("WAREHOUSE", "Warehouse (W)");
        this.FillMainList("TERMINAL", "Terminal Sea / Rail (N)");
        this.FillMainList("TERMINAL2", "Terminal Air (P)");
        this.FillMainList("SHIPPER_VENDOR", "Shipping Vendor (H)");
        this.FillMainList("VENDOR", "General Vendor (G)");
        this.FillMainList("EMPLOYEE", "Employees (E)");
        this.FillMainList("CONTRACTOR", "Contractor (O)");
        this.FillMainList("MISCELLANEOUS", "Miscellaneous (M)");
        this.FillMainList("TBD", "TBD (D)");
        this.FillMainList("BANK", "Bank / Financial Institue (K)");
        this.record.records = this.MainList;
        this.mdata$.next(this.record);
    }

    FillMainList(FldId: string, FldName: string) {
        let Rec = <Tbl_Addr_Catgory>{};
        Rec.cat_id = FldId;
        Rec.cat_name = FldName;
        Rec.cat_yn = "Y";
        Rec.cat_yn_b = true;
        this.MainList.push(Rec)
    }

    SelectDeselect() {

        this.all = !this.all;
        this.record.records.forEach(Rec => {
            Rec.cat_yn_b = this.all;
            this.chkall = this.all;
            if (Rec.cat_yn_b)
                Rec.cat_yn = 'Y';
            else
                Rec.cat_yn = 'N';
        })

    }
    ClientCategoryChk_Click(_rec: Tbl_Addr_Catgory) {
        _rec.cat_yn_b = !_rec.cat_yn_b;
        if (_rec.cat_yn_b)
            _rec.cat_yn = 'Y';
        else
            _rec.cat_yn = 'N';
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
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
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
            this.record.records2 = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record.errormessage = this.gs.getError(error);
            this.mdata$.next(this.record);
            alert(this.record.errormessage);
        });
    }

    IscatgorySelect() {
        let Iscatgory = false;
        try {
            this.record.records.forEach(Rec => {
                if (Rec.cat_yn == "Y") {
                    Iscatgory = true;
                }
            })
        }
        catch (Exception) {
            Iscatgory = false;
        }
        return Iscatgory;
    }

    CreateMails(InvokType: string) {
        if (InvokType == "MAIL") {
            if (!this.Allvalid())
                return;
            if (!confirm("Create Mail"))
                return;
        }

        let filePath: string = "";
        filePath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\Temp\\";
        this.Txt_Error = "";
        this.record.errormessage = "";
        var SearchData = <any>{};
        SearchData.MAIL_SUB = this.gs.isBlank(this.Txt_Subject) ? '' : this.Txt_Subject;
        SearchData.MAIL_MSG = this.gs.isBlank(this.Txt_Message) ? '' : this.Txt_Message;
        SearchData.MSG_FONT = this.gs.user_email_sign_font;
        SearchData.MSG_COLOR = this.gs.user_email_sign_color;
        SearchData.MSG_SIZE = this.gs.user_email_sign_size;
        SearchData.MSG_BOLD = this.gs.user_email_sign_bold;
        SearchData.PATH = filePath;
        SearchData.INVOKE_FRM_VALIDBTN = InvokType;

        const mailRecord = <vm_Tbl_Addr_Catgory>{};
        mailRecord.records = this.MainList;
        mailRecord.userinfo = this.gs.UserInfo;
        mailRecord.filter = SearchData;

        this.CreateMail(mailRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.Txt_Error = response.error;
                }
                else {
                    let msg = "Validation Completed";
                    if (InvokType == "MAIL")
                        msg = "Emails Created";
                    alert(msg);
                }

            }, error => {
                this.record.errormessage = this.gs.getError(error);
            });

    }

    private Allvalid(): boolean {
        var bRet = true;
        let str: string = "";
        if (!this.IscatgorySelect()) {
            bRet = false;
            str += " | Client Category not selected";
        }

        if (this.gs.isBlank(this.Txt_Subject)) {
            bRet = false;
            str += " | Subject cannot be empty";
        }

        if (this.gs.isBlank(this.Txt_Message)) {
            bRet = false;
            str += " | Message body cannot be empty";
        }
        if (bRet == false)
            alert(str);
        return bRet;
    }

    SendMails(_rec: Tbl_Cargo_BulkMail) {
        if (_rec.bm_send_status == "S") {
            alert("Already Sent");
            return;
        }
        if (this.gs.isBlank(this.fromemailid)) {
            alert("From ID cannot be empty");
            return;
        }
        if (this.gs.isBlank(this.emailpassword)) {
            alert("Password cannot be empty");
            return;
        }

        if (!confirm("Send Mail"))
            return;

        let filePath: string = "";
        filePath = "..\\Files_Folder\\" + this.gs.FILES_FOLDER + "\\Temp\\BULKMAIL\\";
        this.record.errormessage = "";
        var SearchData = this.gs.UserInfo;
        SearchData.EMAILID = this.fromemailid;
        SearchData.EMAILPWD = this.emailpassword;
        SearchData.PATH = filePath;
        SearchData.BM_PKID = _rec.bm_pkid;
        SearchData.BM_FILECOUNT = _rec.bm_filecount;
        this.SendMail(SearchData)
            .subscribe(response => {
                this.Txt_Error = response.error;
                if (response.retvalue == true) {
                    // alert('Mail Sent Successfully');
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
            });

    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Bulkmail/List', SearchData, this.gs.headerparam2('authorized'));
    }

    CreateMail(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/LoginService/Bulkmail/CreateMail', SearchData, this.gs.headerparam2('authorized'));
    }

    SendMail(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/LoginService/Bulkmail/SendMail', SearchData, this.gs.headerparam2('authorized'));
    }

    // GetRecord(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Bulkmail/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    // }

    // Save(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Bulkmail/Save', SearchData, this.gs.headerparam2('authorized'));
    // }





}
