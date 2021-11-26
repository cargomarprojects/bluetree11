import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../core/services/global.service';
import { BulkmailModel, Tbl_Addr_Catgory } from '../models/Tbl_Addr_Catgory';

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


    constructor(
        private http2: HttpClient,
        private gs: GlobalService
    ) { }

    public ClearInit() {
        this.record = <BulkmailModel>{
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

        this.record = <BulkmailModel>{
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
    // GetRecord(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnSetting/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    // }

    // Save(SearchData: any) {
    //     return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnSetting/Save', SearchData, this.gs.headerparam2('authorized'));
    // }





}
