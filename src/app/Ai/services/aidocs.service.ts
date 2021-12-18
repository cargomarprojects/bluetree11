import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { Tbl_mast_filesm } from '../models/Tbl_mast_filesm';

@Injectable()
export class AiDocsService {

    public id: string;
    public menuid: string;
    public param_type: string;


    public page_count = 0;
    public page_current = 0;
    public page_rows = 0;
    public page_rowcount = 0;

    public title: string;
    public isAdmin: boolean;
    public canAdd: boolean;
    public canEdit: boolean;
    public canSave: boolean;
    public canDelete: boolean;

    public initlialized: boolean;
    private appid = '';
    
    public searchstring= "";

    public ErrorMessage = "";

    public RecordList: Tbl_mast_filesm[] = [];


    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
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

        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.canAdd = this.gs.canAdd(this.menuid);
        this.canEdit = this.gs.canEdit(this.menuid);
        this.canSave = this.canAdd || this.canEdit;
        this.canDelete = this.gs.canDelete(this.menuid);

        this.initlialized = true;

    }

    List(_type: string) {
        
      let SearchData = {
          type: _type,
          rowtype: _type,
          comp_code : this.gs.globalVariables.comp_code,
          searchstring: this.searchstring.toUpperCase(),
          page_count: this.page_count,
          page_current: this.page_current,
          page_rows: this.page_rows,
          page_rowcount: this.page_rowcount,
          rights_admin : this.isAdmin,
          user_pkid : this.gs.globalVariables.user_pkid,
      };
    
        this.ErrorMessage = '';
        this._List(SearchData)
          .subscribe(response => {
            this.RecordList = response.list;
            this.page_count = response.page_count;
            this.page_current = response.page_current;
            this.page_rowcount = response.page_rowcount;
          },
            error => {
              this.ErrorMessage = this.gs.getError(error);
            });
        }
    


    _List(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/AwsAi/List', SearchData, this.gs.headerparam2('authorized'));

    }


    LoadDefault(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/App_Settings/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }



    GetRecord(SearchData : any) {
        
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/App_Settings/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/App_Settings/Save', Record, this.gs.headerparam2('authorized-fileupload'));
    }

    Delete(SearchData : any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Admin/App_Settings/Delete', SearchData, this.gs.headerparam2('authorized'));
    }


}

