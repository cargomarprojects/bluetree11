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

        var SearchData = this.gs.UserInfo;
        this.List(SearchData).subscribe(response => {
            this.record.records = response.list;
            this.mdata$.next(this.record);
        }, error => {
            this.record = <QtnmModel>{
                records: [],
                errormessage: this.gs.getError(error),
            }
            this.mdata$.next(this.record);
        });
    }


    List(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnSetting/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnSetting/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Marketing/QtnSetting/Save', SearchData, this.gs.headerparam2('authorized'));
    }



}
