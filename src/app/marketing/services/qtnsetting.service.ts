import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { QtnmModel, Tbl_Cargo_Qtnm } from '../models/tbl_cargo_qtnm';

@Injectable({
    providedIn: 'root'
})
export class QtnSettingService {

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

    public initlialized: boolean;
    private appid = '';
    MainList: Tbl_Cargo_Qtnm[] = [];


    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.record = <QtnmModel>{
            errormessage: '',
            records: []
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
            errormessage: '',
            records: []
        };

        this.mdata$.next(this.record);

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);

        this.initlialized = true;
        this.Search();
    }

    Search() {

        this.MainList = new Array<Tbl_Cargo_Qtnm>();
        this.FillMainList("", "QUOTATION AIR");
        this.FillMainList("AIRMSG1", "Msg 1 (C-Imp)");
        this.FillMainList("AIRMSG2", "Msg 2 (C-Exp)");
        this.FillMainList("AIRMSG3", "Msg 3 (A-Exp)");
        this.FillMainList("", "QUOTATION FCL");
        this.FillMainList("FCLMSG1", "Msg 1 (C-Imp)");
        this.FillMainList("FCLMSG2", "Msg 2 (C-Exp)");
        this.FillMainList("FCLMSG3", "Msg 3 (A-Exp)");
        this.FillMainList("", "QUOTATION LCL & LOCAL");
        this.FillMainList("LCLMSG1", "Msg 1 (C-Imp)");
        this.FillMainList("LCLMSG2", "Msg 2 (C-Exp)");
        this.FillMainList("LCLMSG3", "Msg 3 (C-Local)");
        this.FillMainList("LCLMSG4", "Msg 4 (A-Exp)");
        this.FillMainList("LCLMSG5", "Msg 5 (A-Local)");
        this.FillMainList("LCLMSG6", "DDU/DDP");
        this.FillMainList("", "INVOICE FOOTER NOTE");
        this.FillMainList("INV_FTR_CR_GULF", "Invoice Footer Debit Note");
        this.FillMainList("INV_FTR_DR_GULF", "Invoice Footer Credit Note");

        this.record.records = this.MainList;
        this.mdata$.next(this.record);
    }

    FillMainList(FldId: string, FldName: string) {
        let RecQtn = <Tbl_Cargo_Qtnm>{};
        RecQtn.qtnm_no = FldId;
        RecQtn.qtnm_to_name = FldName;
        this.MainList.push(RecQtn)
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnSetting/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnSetting/Save', SearchData, this.gs.headerparam2('authorized'));
    }



}
