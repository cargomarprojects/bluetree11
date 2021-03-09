import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';

import { User_Menu } from '../models/menum';
import { Modulem } from '../models/modulem';

import { Companym } from '../models/company';
import { Yearm } from '../models/yearm';
import { ClearService } from '../services/clear.service';

@Component({
    selector: 'app-login2',
    templateUrl: './login2.component.html',
    styleUrls: ['./login2.component.css'],
    providers: [LoginService]
})
export class Login2Component implements OnInit {

    loading: boolean = false;
    errorMessage: string = '';


    mRec: Modulem = null;

    CompanyList: Companym[];
    Company_Id: string = '';


    Comp_Row: any;
    Year_Row: any;

    YearList: any[];
    Year_Id: string = '';




    AccGroupList: any[];


    constructor(
        private mainservice: LoginService,
        public GLOBALCONTANTS: GlobalService,
        public clrservice: ClearService,
        private router: Router
    ) {

        this.GLOBALCONTANTS.Modules = null;
        this.GLOBALCONTANTS.MenuList = null;

        this.GLOBALCONTANTS.IsAuthenticated = false;
        this.LoadCombo();
    }

    ngOnInit() {
    }

    LoadCombo() {

        this.loading = true;



        let userid = this.GLOBALCONTANTS.user_pkid;
        if (this.GLOBALCONTANTS.user_isadmin == "Y")
            userid = '';


        let SearchData = {
            CompanyId: this.GLOBALCONTANTS.company_pkid,
            User_Id: userid
        };

        this.mainservice.LoadCompanyYearList(SearchData)
            .subscribe(response => {
                
                this.CompanyList = response.companylist;
                this.YearList = response.yearlist;
                this.GLOBALCONTANTS.SetupCompanyList(response.companylist);
                this.GLOBALCONTANTS.AccGroupList = response.accgrouplist;;

                response.companylist.forEach(a => {
                    if (this.Company_Id == '')
                        this.Company_Id = a.comp_pkid;
                });

                response.yearlist.forEach(a => {
                    this.Year_Id = a.fy_pkid;
                });
                this.loading = false;
            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }

    async Login() {

        const rid = this.GLOBALCONTANTS.getRandomInt();
        this.GLOBALCONTANTS.appid = rid.toString();
        if  ( rid <= 0)
        {
            alert('Cannot Generate Appliation ID ');
            return;
        }


        this.Comp_Row = this.CompanyList.find(a => a.comp_pkid == this.Company_Id);
        this.Year_Row = this.YearList.find(a => a.fy_pkid == this.Year_Id);

        this.GLOBALCONTANTS.user_ua_pkid = this.Comp_Row.ua_pkid;
        this.GLOBALCONTANTS.branch_pkid = this.Comp_Row.comp_pkid;
        this.GLOBALCONTANTS.branch_code = this.Comp_Row.comp_code;
        this.GLOBALCONTANTS.branch_name = this.Comp_Row.comp_name;
        this.GLOBALCONTANTS.branch_add1 = this.Comp_Row.comp_add1;
        this.GLOBALCONTANTS.branch_add2 = this.Comp_Row.comp_add2;
        this.GLOBALCONTANTS.branch_add3 = this.Comp_Row.comp_add3;
        this.GLOBALCONTANTS.branch_add4 = this.Comp_Row.comp_add4;
        this.GLOBALCONTANTS.branch_prefix = this.Comp_Row.comp_prefix;


        this.GLOBALCONTANTS.USER_LOCATION_ID = +this.Comp_Row.comp_code;
        this.GLOBALCONTANTS.REC_BRANCH_CODE = this.Comp_Row.comp_code;

        this.GLOBALCONTANTS.ADDRESS_LINE1 = this.Comp_Row.comp_line1;
        this.GLOBALCONTANTS.ADDRESS_LINE2 = this.Comp_Row.comp_line2;
        this.GLOBALCONTANTS.ADDRESS_LINE3 = this.Comp_Row.comp_line3;
        this.GLOBALCONTANTS.ADDRESS_LINE4 = this.Comp_Row.comp_line4;
        this.GLOBALCONTANTS.ADDRESS_LINE5 = this.Comp_Row.comp_line5;

        this.GLOBALCONTANTS.ADDRESS_DUMMY_LINE1 = this.Comp_Row.comp_dummy1;
        this.GLOBALCONTANTS.ADDRESS_DUMMY_LINE2 = this.Comp_Row.comp_dummy2;
        this.GLOBALCONTANTS.ADDRESS_DUMMY_LINE3 = this.Comp_Row.comp_dummy3;
        this.GLOBALCONTANTS.ADDRESS_DUMMY_LINE4 = this.Comp_Row.comp_dummy4;
        this.GLOBALCONTANTS.ADDRESS_DUMMY_LINE5 = this.Comp_Row.comp_dummy5;


        this.GLOBALCONTANTS.year_pkid = this.Year_Row.fy_pkid;
        this.GLOBALCONTANTS.year_code = this.Year_Row.fy_code;
        this.GLOBALCONTANTS.year_name = this.Year_Row.fy_name;
        this.GLOBALCONTANTS.year_start_date = this.GLOBALCONTANTS.replaceAll(this.Year_Row.fy_start_date, "/", "-");
        this.GLOBALCONTANTS.year_end_date = this.GLOBALCONTANTS.replaceAll(this.Year_Row.fy_end_date, "/", "-");
        this.GLOBALCONTANTS.year_islocked = this.Year_Row.fy_islocked;

        this.GLOBALCONTANTS.InitUserInfo();

        this.SetupYearList();

        await this.GLOBALCONTANTS.LoadSettings();
        await this.GLOBALCONTANTS.LoadMenu();
       
        this.GLOBALCONTANTS.IsAuthenticated = true;
        this.GLOBALCONTANTS.GSESSION += 1;
        
        this.GLOBALCONTANTS.Save2LocalStorage();

        this.router.navigate(['home'], { replaceUrl: true });
    }


    SetupYearList() {
        this.GLOBALCONTANTS.YearList = [];
        this.GLOBALCONTANTS.software_start_year = 0;

        this.YearList.forEach(mRec => {
            if (this.GLOBALCONTANTS.software_start_year == 0) {
                this.GLOBALCONTANTS.software_start_year = mRec.fy_code;
            }
            else {
                if (mRec.fy_code < this.GLOBALCONTANTS.software_start_year)
                    this.GLOBALCONTANTS.software_start_year = mRec.fy_code;
            }
        });
        /*
        Rec = new LgnSrv.User_Yearm();
        Rec.fy_pkid = mRec.fy_pkid;
        Rec.fy_code = mRec.fy_code;
        Rec.fy_name  = mRec.fy_name;
        Rec.fy_start_date = mRec.fy_start_date;
        Rec.fy_end_date = mRec.fy_end_date;
        Rec.fy_islocked = mRec.fy_islocked;
        GLOBALCONTANTS.YearList.Add(Rec); 
        */    
    }




    // moved to global service
    LoadSettings() {

        var SearchData: any = {};
        SearchData = this.GLOBALCONTANTS.UserInfo;
        SearchData.PARAM_TYPE = "ALL SETTINGS";
        SearchData.SCREEN = "LOGIN2";
        SearchData["SET-LOGIN"] = "Y";


        this.mainservice.LoadSettings(SearchData)
            .subscribe(response => {
                this.GLOBALCONTANTS.MainList = response.list;
                this.loading = false;

                this.GLOBALCONTANTS.InitData();

                this.GLOBALCONTANTS.InitUserInfo();
                
                //this.GLOBALCONTANTS.InitMonths();

                //this.GLOBALCONTANTS.Save2LocalStorage();

            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }

    // Moved To Global Service
    LoadMenu() {

        var module_name = '';

        var SearchData: any = {};
        SearchData = this.GLOBALCONTANTS.UserInfo;

        if (this.GLOBALCONTANTS.user_isadmin == "Y")
            SearchData.UA_ID = "";
        else
            SearchData.UA_ID = this.GLOBALCONTANTS.user_ua_pkid;


        this.mainservice.LoadMenu(SearchData)
            .subscribe(response => {

                this.GLOBALCONTANTS.MenuList = response.list;
                this.GLOBALCONTANTS.Modules = [];
                response.list.forEach(element => {
                    if (module_name != element.module_name) {
                        this.mRec = new Modulem();
                        this.mRec.module_name = element.module_name;
                        this.GLOBALCONTANTS.Modules.push(this.mRec);
                        module_name = element.module_name;
                    }
                });

                //this.GLOBALCONTANTS.Save2LocalStorage();

                this.loading = false;
            }, error => {
                this.loading = false;
                this.errorMessage = error.error.error_description;
                alert(this.errorMessage);
            });
    }





    Cancel() {
        this.router.navigate(['login'], { replaceUrl: true });
    }

}
