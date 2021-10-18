import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalService } from '../../core/services/global.service';

import { AutoComplete2Component } from '../../shared/autocomplete2/autocomplete2.component';
import { InputBoxComponent } from '../../shared/input/inputbox.component';

import { ModuleService } from '../services/modulem.service';
import { User_Menu } from '../../core/models/menum';
import { vm_Tbl_User_Access, Tbl_User_Access, Tbl_User_Rightsm } from '../models/Tbl_User_Rights';

import { SearchTable } from '../../shared/models/searchtable';
import { UserRightsService } from '../services/userRights.service';
//EDIT-AJITH-06-09-2021
//EDIT-AJITH-08-09-2021
//EDIT-AJITH-18-10-2021

@Component({
    selector: 'app-rights-edit',
    templateUrl: './rights-edit.component.html'
})
export class RightsEditComponent implements OnInit {

    record: Tbl_User_Access = <Tbl_User_Access>{};

    records: Tbl_User_Rightsm[] = [];

    records2: Tbl_User_Rightsm[] = [];

    companyList: any[];
    userList: any[];

    moduleList: any[];


    tab: string = 'main';

    pkid: string;
    menuid: string;
    public mode: string = '';
    errorMessage: string;
    Foregroundcolor: string;

    title: string;
    isAdmin: boolean;
    refno: string = "";
    public ua_usr_id: string = "''";

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public gs: GlobalService,
        public mainService: UserRightsService,

    ) { }

    ngOnInit() {
        this.gs.checkAppVersion();
        const options = this.route.snapshot.queryParams;

        this.menuid = options.menuid;
        this.pkid = options.pkid;
        this.mode = options.mode;

        this.initPage();
        this.actionHandler();
    }

    private initPage() {
        this.isAdmin = this.gs.IsAdmin(this.menuid);
        this.title = this.gs.getTitle(this.menuid);
        this.errorMessage = '';
        this.LoadCompany();
        this.LoadUser();
    }

    LoadCompany() {

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.CODE = "";
        SearchData.TYPE = "USR_BRANCH";
        SearchData.PKID = this.gs.company_pkid;
        this.mainService.getCompanyList(SearchData).subscribe(response => {
            this.companyList = <any>response.list;
        }, error => {
            this.errorMessage = this.gs.getError(error);
        });
    }

    LoadUser() {
        this.ua_usr_id = '';
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.CODE = "";
        SearchData.TYPE = "";

        this.mainService.getUserList(SearchData).subscribe(response => {
            this.userList = <any>response.list;
        }, error => {
            this.errorMessage = this.gs.getError(error);
        });
    }


    NewRecord() {
        this.mode = 'ADD'
        this.actionHandler();
    }

    actionHandler() {
        this.errorMessage = '';
        if (this.mode == 'ADD') {
            this.record = <Tbl_User_Access>{};
            this.pkid = this.gs.getGuid();
            this.record.ua_default = 'N';
            this.init();
        }
        if (this.mode == 'EDIT') {
            this.GetRecord();
        }
    }

    init() {
        this.record.ua_pkid = this.pkid;
        this.record.comp_name = '';
        this.record.rec_created_by = this.gs.user_code;
        this.record.rec_created_date = this.gs.defaultValues.today;

        let parameter = {
            appid: this.gs.appid,
            menuid: this.menuid,
            pkid: this.pkid,
            type: '',
            origin: 'rights-page',
            mode: 'EDIT'
        };
        this.location.replaceState('Silver.UserAdmin/RightsEditPage', this.gs.getUrlParameter(parameter));

    }

    GetRecord() {
        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = this.pkid;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.record = <Tbl_User_Access>response.record;
                this.records = <Tbl_User_Rightsm[]>response.records;
                this.getModules(this.records);
                this.mode = 'EDIT';
            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

    swap(rec, fld) {
        if (fld == 'all') {
            rec.rights_all = !rec.rights_all;
            rec.rights_company = 'N';
            rec.rights_admin = 'N';
            rec.rights_add = rec.rights_all ? 'Y' : 'N';
            rec.rights_edit = rec.rights_all ? 'Y' : 'N';
            rec.rights_view = rec.rights_all ? 'Y' : 'N';
            rec.rights_delete = 'N';
            rec.rights_print = rec.rights_all ? 'Y' : 'N';
            rec.rights_email = rec.rights_all ? 'Y' : 'N';
        }
        if (fld == 'company')
            rec.rights_company = rec.rights_company == 'Y' ? 'N' : 'Y';
        if (fld == 'admin')
            rec.rights_admin = rec.rights_admin == 'Y' ? 'N' : 'Y';
        if (fld == 'add')
            rec.rights_add = rec.rights_add == 'Y' ? 'N' : 'Y';
        if (fld == 'edit')
            rec.rights_edit = rec.rights_edit == 'Y' ? 'N' : 'Y';
        if (fld == 'view')
            rec.rights_view = rec.rights_view == 'Y' ? 'N' : 'Y';
        if (fld == 'delete')
            rec.rights_delete = rec.rights_delete == 'Y' ? 'N' : 'Y';
        if (fld == 'print')
            rec.rights_print = rec.rights_print == 'Y' ? 'N' : 'Y';
        if (fld == 'email')
            rec.rights_email = rec.rights_email == 'Y' ? 'N' : 'Y';
    }


    getModules(list: any[]) {
        this.moduleList = [];
        list.filter((rec) => {
            if (this.moduleList.indexOf(rec.module_name) == -1)
                this.moduleList.push(rec.module_name);
        })
        if (this.moduleList.length > 0) {
            this.filterRecord(this.moduleList[0])
        }
        else
            this.filterRecord('');
    }

    filterRecord(tagName: string) {
        this.records2 = this.records.filter(rec => rec.module_name == tagName);
    }

    selectRecord = (rec: Tbl_User_Rightsm) => rec.rights_company || rec.rights_admin || rec.rights_add || rec.rights_edit || rec.rights_view || rec.rights_delete || rec.rights_print;

    Save() {
        if (!this.Allvalid())
            return;
        if (!confirm("Save")) {
            return;
        }
        this.SaveParent();
        const saveRecord = <vm_Tbl_User_Access>{};
        saveRecord.record = this.record;
        saveRecord.records = this.records.filter(this.selectRecord);

        saveRecord.pkid = this.pkid;
        saveRecord.mode = this.mode;
        saveRecord.userinfo = this.gs.UserInfo;

        this.mainService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.mode = 'EDIT';
                    this.mainService.RefreshList(this.record);
                    // this.errorMessage = 'Save Complete';
                    // alert(this.errorMessage);
                    alert('Save Complete');
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    private SaveParent() {

    }
    private Allvalid(): boolean {

        var bRet = true;
        this.errorMessage = "";

        if (this.gs.isBlank(this.pkid)) {
            bRet = false;
            this.errorMessage = "Invalid ID";
            alert(this.errorMessage);
            return bRet;
        }

        if (this.gs.isBlank(this.record.ua_company_id)) {
            alert("Company has to be selected");
            return false;
        }
        if (this.gs.isBlank(this.record.ua_usr_id)) {
            alert("User has to be selected");
            return false;
        }

        return bRet;
    }


    Close() {
        this.location.back();
    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "ACC_GROUPM") {
        }

    }

    OnChange(field: string) {
    }

    onFocusout(field: string) {
    }

    onBlur(field: string) {

    }

    LoadUserRights() {
        if (this.gs.isBlank(this.ua_usr_id)) {
            alert("Please Select a User and Continue.....");
            return;
        }

        let SearchData2 = {
            company_code: this.gs.company_code,
            table: '',
            pkid: '',
            ua_company_id: '',
            ua_usr_id: ''
        };

        SearchData2.table = "USER-ACCESS-ID";
        SearchData2.ua_company_id = this.record.ua_company_id;
        SearchData2.ua_usr_id = this.ua_usr_id;
        this.gs.SearchRecord(SearchData2)
            .subscribe(response => {

                if (!this.gs.isBlank(response.ua_pkid))
                    this.LoadUserRightsDetails(response.ua_pkid);
            },
                error => {
                    let err = this.gs.getError(error);
                    alert(err);
                });
    }

    LoadUserRightsDetails(_Id: string) {

        this.errorMessage = '';
        var SearchData = this.gs.UserInfo;
        SearchData.pkid = _Id;
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.records = <Tbl_User_Rightsm[]>response.records;
                if (!this.gs.isBlank(this.records)) {
                    this.records.forEach(Rec => {
                        Rec.rights_pkid = this.gs.getGuid();
                    })
                    this.getModules(this.records);
                }

            }, error => {
                this.errorMessage = this.gs.getError(error);
            });
    }

}
