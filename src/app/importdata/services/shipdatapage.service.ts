import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { GlobalService } from '../../core/services/global.service';
import { Tbl_edi_master, Tbl_edi_house, ShipDataPageModel } from '../models/tbl_edi_master';
import { SearchQuery } from '../models/tbl_edi_master';
import { PageQuery } from '../../shared/models/pageQuery';

@Injectable({
    providedIn: 'root'
})
export class ShipDataPageService {

    private mdata$ = new BehaviorSubject<ShipDataPageModel>(null);
    get data$(): Observable<ShipDataPageModel> {
        return this.mdata$.asObservable();
    }
    public record: ShipDataPageModel;

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
    
    private selectdeselect: boolean = false;
    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.record = <ShipDataPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', sender: '', chkpending: true, chkcompleted: true, chkdeleted: true, linkType: 'MBL#' },
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
        this.selectdeselect = false;

        this.record = <ShipDataPageModel>{
            errormessage: '',
            records: [],
            searchQuery: <SearchQuery>{ searchString: '', sender: '', chkpending: true, chkcompleted: true, chkdeleted: true, linkType: 'MBL#' },
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
        let sFlag: string = "";
        if (this.record.searchQuery.chkcompleted == true)
            sFlag += "Y";
        if (this.record.searchQuery.chkpending == true)
            sFlag += "N";
        if (this.record.searchQuery.chkdeleted == true)
            sFlag += "D";

        var SearchData = this.gs.UserInfo;
        SearchData.outputformat = 'SCREEN';
        SearchData.action = 'NEW';
        SearchData.pkid = this.id;
        SearchData.TYPE = this.param_type;
        SearchData.page_rowcount = this.gs.ROWS_TO_DISPLAY;
        if (this.gs.isBlank(this.record.searchQuery.sender))
            SearchData.CODE = '';
        else
            SearchData.CODE = this.record.searchQuery.sender;
        if (this.gs.isBlank(this.record.searchQuery.searchString))
            SearchData.MBL_HBL = '';
        else
            SearchData.MBL_HBL = this.record.searchQuery.searchString;
        if (this.gs.isBlank(this.record.searchQuery.linkType))
            SearchData.LINK_TYPE = 'MBL#';
        else
            SearchData.LINK_TYPE = this.record.searchQuery.linkType;
        SearchData.FLAG = sFlag;
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
            this.record.records.forEach(Rec => {
                Rec.selected_b = false;
                Rec.selected = 'N';
            })
            this.mdata$.next(this.record);
        }, error => {
            this.record = <ShipDataPageModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }
    RefreshList(_rec: Tbl_edi_master) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.masterid == _rec.masterid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.messagesender = _rec.messagesender;
            REC.updated_status = _rec.updated_status;
            REC.messagenumber = _rec.messagenumber;
            REC.messagedate = _rec.messagedate;
            REC.mshipper_name = _rec.mshipper_name;
            REC.consignee_name = _rec.consignee_name;
            REC.pol_name = _rec.pol_name;
            REC.pol_etd = _rec.pol_etd;
            REC.pod_name = _rec.pod_name;
            REC.pod_eta = _rec.pod_eta;
            REC.place_delivery = _rec.place_delivery;
            REC.mbl_refno = _rec.mbl_refno;
            REC.mbl_branch_code = _rec.mbl_branch_code;
            REC.mblno = _rec.mblno;
            REC.house_nos = _rec.house_nos;
            REC.refno = _rec.refno;
            REC.agent_name = _rec.agent_name;
            REC.carrier_name = _rec.carrier_name;
        }
    }

    SelectDeselect(_record: Tbl_edi_master) {
        this.selectdeselect = !this.selectdeselect;
        _record.selected_b = this.selectdeselect;
        _record.selected = _record.selected_b == true ? 'Y' : 'N';
    }


    CheckMaster(_masterid: string) {
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.DUP_CHK_ONLY = 'Y';
        SearchData.MASTERID = _masterid;
        this.CheckMasterData(SearchData)
            .subscribe(response => {
                if (response.retvalue == true) {
                    if (response.warningmsg.trim().length > 0) {
                        alert(response.warningmsg);
                    }
                }
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }


    DeleteRow(_rec: Tbl_edi_master) {

        let sRemarks: string = "Mbl No : " + _rec.mblno + ", Msg No: " + _rec.messagenumber;
        this.record.errormessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _rec.masterid;
        SearchData.remarks = sRemarks;

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.record.errormessage = response.error;
                    alert(this.record.errormessage);
                }
                else {
                    for (let rec of this.record.records.filter(rec => rec.masterid == _rec.masterid)) {
                        rec.rec_updated = "D";
                        rec.updated_status = "DELETED-" + this.gs.user_code + "-" + response.currentdate;
                    }
                }
                this.mdata$.next(this.record);
            }, error => {
                this.record.errormessage = this.gs.getError(error);
                alert(this.record.errormessage);
                this.mdata$.next(this.record);
            });
    }

    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/shipdatapage/List', SearchData, this.gs.headerparam2('authorized'));
    }

    MissingList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/shipdatapage/MissingList', SearchData, this.gs.headerparam2('authorized'));
    }

    CheckMasterData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/shipdatapage/CheckMasterData', SearchData, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/shipdatapage/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    HouseList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/shipdatapage/HouseList', SearchData, this.gs.headerparam2('authorized'));
    }
    DeleteHouseRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/shipdatapage/DeleteHouseRecord', SearchData, this.gs.headerparam2('authorized'));
    }
    TransferData(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/ImportData/shipdatapage/TransferData', SearchData, this.gs.headerparam2('authorized'));
    }

}
