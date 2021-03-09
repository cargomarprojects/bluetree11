
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_cargo_general, OthGeneralModel, vm_tbl_cargo_general } from '../models/tbl_cargo_general';
import { SearchQuery } from '../models/tbl_cargo_general';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class LockUnlockService {

    private mdata$ = new BehaviorSubject<OthGeneralModel>(null);
    get data$(): Observable<OthGeneralModel> {
        return this.mdata$.asObservable();
    }
    private record: OthGeneralModel;

    public id: string;
    public menuid: string;
    public param_type: string;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public lock_all: boolean = false;
    public unlock_all: boolean = false;
    public initlialized: boolean;
    private LSESSION = 0;
    
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.record = <OthGeneralModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, mode: 'ALL', cust_id: '', cust_name: '', branch: this.gs.branch_code, lock_type: 'ALL' },
            pageQuery: <PageQuery>{ action: 'NEW', page_count: 0, page_current: -1, page_rowcount: 0, page_rows: 0 }
        };
        this.mdata$.next(this.record);
    }

    public init(params: any) {
        if (this.LSESSION < this.gs.GSESSION) {
            this.LSESSION = this.gs.GSESSION;
            this.initlialized = false;
        }
        if (this.initlialized) {
            this.record.errormessage = '';
            this.mdata$.next(this.record);
            return;
        }

        this.id = params.id;
        this.menuid = params.id;
        this.param_type = params.param_type;

        this.record = <OthGeneralModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', fromdate: this.gs.getPreviousDate(this.gs.SEARCH_DATE_DIFF), todate: this.gs.defaultValues.today, mode: 'ALL', cust_id: '', cust_name: '', branch: this.gs.branch_code, lock_type: 'ALL' },
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
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        SearchData.SDATE = this.record.searchQuery.fromdate;
        SearchData.EDATE = this.record.searchQuery.todate;
        SearchData.MODE = this.record.searchQuery.mode;
        SearchData.CUST_ID = this.record.searchQuery.cust_id;
        SearchData.REF_NO = this.record.searchQuery.searchString;
        SearchData.LOCK_TYPE = this.record.searchQuery.lock_type;
        SearchData.COMP_TYPE = this.record.searchQuery.branch;
        if (this.record.searchQuery.branch === 'ALL') {
            SearchData.COMP_CODE = this.gs.branch_codes;
        } else {
            SearchData.COMP_CODE = this.record.searchQuery.branch;
        }
        SearchData.COMP_NAME = this.gs.branch_name;
        SearchData.LOCK_DAYS_SEA = this.gs.LOCK_DAYS_SEA.toString();
        SearchData.LOCK_DAYS_AIR = this.gs.LOCK_DAYS_AIR.toString();
        SearchData.LOCK_DAYS_OTHERS = this.gs.LOCK_DAYS_OTHERS.toString();
        SearchData.LOCK_DAYS_ADMIN = this.gs.LOCK_DAYS_ADMIN.toString();
        SearchData.TODAYS_DATE = this.gs.defaultValues.today;  //DateTime.Now.ToString("yyyy-MM-dd"));

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
            if (this.record.records != null)
                this.record.records.forEach(Rec => {
                    Rec.mbl_lock_yn_b = Rec.mbl_lock_yn == 'Y' ? true : false;
                    Rec.mbl_unlock_yn_b = Rec.mbl_unlock_yn == 'Y' ? true : false;
                })
            this.mdata$.next(this.record);
        }, error => {
            this.record = <OthGeneralModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }

    Lock(_rec: Tbl_cargo_general) {
        this.record.records.forEach(Rec => {
            if (Rec.mbl_pkid == _rec.mbl_pkid) {
                Rec.mbl_lock_yn = 'Y';
                Rec.mbl_lock_yn_b = true;
                Rec.mbl_unlock_yn = 'N';
                Rec.mbl_unlock_yn_b = false;
            }
        })
    }

    Unlock(_rec: Tbl_cargo_general) {
        this.record.records.forEach(Rec => {
            if (Rec.mbl_pkid == _rec.mbl_pkid) {
                Rec.mbl_lock_yn = 'N';
                Rec.mbl_lock_yn_b = false;
                Rec.mbl_unlock_yn = 'Y';
                Rec.mbl_unlock_yn_b = true;
            }
        })
    }

    LockUnlock(_type: string) {
        this.record.records.forEach(Rec => {
            if (_type === "LOCK") {
                this.lock_all = true;
                this.unlock_all = false;
                Rec.mbl_lock_yn = 'Y';
                Rec.mbl_lock_yn_b = true;
                Rec.mbl_unlock_yn = 'N';
                Rec.mbl_unlock_yn_b = false;
            } else if (_type === "UNLOCK") {
                this.lock_all = false;
                this.unlock_all = true;
                Rec.mbl_lock_yn = 'N';
                Rec.mbl_lock_yn_b = false;
                Rec.mbl_unlock_yn = 'Y';
                Rec.mbl_unlock_yn_b = true;
            }
        })
    }


    LockUnlockRecord() {

        if (!this.Allvalid())
            return;

        const saveRecord = <vm_tbl_cargo_general>{};
        saveRecord.records = this.record.records;
        saveRecord.userinfo = this.gs.UserInfo;

        this.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    this.mdata$.next(this.record);
                }
                else {

                    let sRemark: string = "";
                    this.record.records.forEach(Rec => {
                        sRemark = "";
                        if (Rec.mbl_lock_status == "L") {
                            if (Rec.mbl_unlock_yn == "Y") {
                                sRemark = "UNLOCKED";
                                Rec.mbl_lock_status = "U";
                            }
                        }
                        else if (Rec.mbl_lock_status == "U") {
                            if (Rec.mbl_lock_yn == "Y") {
                                sRemark = "LOCKED";
                                Rec.mbl_lock_status = "L";
                            }
                        }
                        if (sRemark.trim() != "") {
                            sRemark += "-";
                            sRemark += this.getDispFormatDate(this.gs.defaultValues.today);
                            // DateTime.Now.ToString(GLOBALCONTANTS.FRONTEND_DATEFORMAT);
                            sRemark += "-";
                            sRemark += this.gs.user_code;
                            Rec.mbl_ulcode = sRemark;
                        }

                    })
                    this.mdata$.next(this.record);
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    getDispFormatDate(_sDate) {

        var tempdt = _sDate.split('-');
        let yr: string = tempdt[0];
        let mn: string = tempdt[1];
        let dy: string = tempdt[2];

        if (this.gs.FRONTEND_DATEFORMAT == "MM/dd/yyyy")
            return mn + "/" + dy + "/" + yr;
        else if (this.gs.FRONTEND_DATEFORMAT == "dd/MM/yyyy")
            return dy + "/" + mn + "/" + yr;
        else
            return ''
    }


    private Allvalid(): boolean {
        var bRet = true;

        if (this.record.records == null) {
            bRet = false;
            this.record.errormessage = "No List Found";
        }
        else if (this.record.records.length <= 0) {
            bRet = false;
            this.record.errormessage = "No List Found";
        }

        if (bRet == false)
            this.mdata$.next(this.record);
        return bRet;
    }

    Instant_Lock_Unlock(_searchdata: any, type: string = '') {
        var bRet = true;
        if (this.gs.isBlank(this.record.searchQuery.fromdate)) {
            bRet = false;
            this.record.errormessage = "Invalid From Date";
        }
        if (this.gs.isBlank(this.record.searchQuery.todate)) {
            bRet = false;
            this.record.errormessage = "Invalid To Date";
        }
        if (this.gs.isBlank(this.record.searchQuery.branch)) {
            bRet = false;
            this.record.errormessage = "Branch cannot be null";
        }

        if (bRet == false) {
            this.mdata$.next(this.record);
            return bRet;
        }

        let Msg: string = "";
        Msg = "THIS WILL " + type + " ALL DOCUMENTS OF ";
        Msg += (this.record.searchQuery.branch == "ALL" ? "ALL BRANCHES" : this.record.searchQuery.branch) + " \nFROM ";
        Msg += this.getDispFormatDate(this.record.searchQuery.fromdate) + " TO ";
        Msg += this.getDispFormatDate(this.record.searchQuery.todate);

        if (!confirm(Msg))
            return;

        this.record.errormessage = '';
        this.record.searchQuery = _searchdata.searchQuery;

        var SearchData = this.gs.UserInfo;
        SearchData.FDATE = this.record.searchQuery.fromdate;
        SearchData.TDATE = this.record.searchQuery.todate;
        SearchData.LOCK_TYPE = type;
        SearchData.COMP_TYPE = this.record.searchQuery.branch;
        if (this.record.searchQuery.branch === 'ALL') {
            SearchData.COMP_CODE = this.gs.branch_codes;
        } else {
            SearchData.COMP_CODE = this.record.searchQuery.branch;
        }

        this.InstantLockUnlock(SearchData).subscribe(response => {
            if (response.retvalue == false) {
                this.record.errormessage = response.error;
                this.mdata$.next(this.record);
            }

        }, error => {
            this.record = <OthGeneralModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/LockUnlock/List', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/LockUnlock/Save', SearchData, this.gs.headerparam2('authorized'));
    }
    InstantLockUnlock(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Other/LockUnlock/InstantLockUnlock', SearchData, this.gs.headerparam2('authorized'));
    }
}

