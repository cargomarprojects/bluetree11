import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../services/login.service';
import { GlobalService } from '../services/global.service';
import { ClearService } from '../services/clear.service';
import { Companym } from '../models/company';

import { logoutAction, AppState } from 'src/app/reducer';
import { Store } from '@ngrx/store';

import { environment } from '../../../environments/environment';

//EDIT JOY 09/11/2021

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  loading: Boolean = false;
  showloginbutton: Boolean = false;

  errorMessage: string = '';




  username: string = '';
  password: string = '';

  server_software_version_string = '';


  CompanyList: Companym[];

  Company_Id: string = '';
  Company_Code: string = '';



  constructor(
    private mainservice: LoginService,
    public gs: GlobalService,
    public clrservice: ClearService,
    private router: Router,
    private store: Store<AppState>
  ) {

    this.gs.UserRecord = null;
    this.gs.Modules = null;
    this.gs.MenuList = null;
    this.gs.IsLoginSuccess = false;
    this.gs.IsAuthenticated = false;
    this.showloginbutton = false;

    this.username = '';
    this.password = '';
    //this.username = 'CUST-VIRTRA'; // consignee
    //this.username = 'CUST-CLUHOU'; // consignee
    //this.username = 'CUST-PARGRA'; // agent

    this.LoadCombo();
  }

  ngOnInit() {
    this.store.dispatch(logoutAction());
  }



  LoadCombo() {

    this.loading = true;
    let SearchData = {
      TYPE: 'USR_COMPANY'
    };


    this.showloginbutton = false;
    this.mainservice.LoadCompany(SearchData)
      .subscribe(response => {
        this.CompanyList = response.list;
        this.server_software_version_string = response.version;
        if (this.gs.software_version_string === this.server_software_version_string) {
          this.showloginbutton = true;
        }
        else {
          this.errorMessage = "New Version Available, Kindly Clear Browser History";
          this.showloginbutton = false;
        }

        response.list.forEach(a => {
          this.Company_Id = a.pkid;
        })

        this.loading = false;
      }, error => {
        this.loading = false;
        this.errorMessage = error.message;
        alert(this.errorMessage);
      });
  }

  Login() {



    if (!this.username) {
      this.errorMessage = 'Login ID Cannot Be Blank';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password Cannot Be Blank';
      return;
    }

    this.username = this.username.toUpperCase();
    this.password = this.password.toUpperCase();

    this.loading = true;

    this.mainservice.Login(this.username, this.password, this.Company_Id)
      .subscribe(response => {
        this.loading = false;
        let user = response;
        if (user && user.access_token) {
          this.gs.IsLoginSuccess = true;
          this.gs.Access_Token = user.access_token;
          this.gs.User_Category = user.usr_category;
          if (this.gs.IsLoginSuccess) {
            this.errorMessage = "Login Success";
            this.gs.user_pwd = this.password;
            // this.clrservice.ClearInit();
            this.Login1();
          }
          else {
            this.errorMessage = "Login Failed";
          }
        }
      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
      });
  }


  Cancel() {
    setTimeout(() => {
      this.router.navigate(['home'], { replaceUrl: true });
    });
  }



  Login1() {

    let SearchData = {
      sCompanyId: this.Company_Id,
      sUserId: this.username,
      sPwd: this.password,
      category: this.gs.User_Category
    };


    this.mainservice.Login1(SearchData)
      .subscribe(response => {

        this.gs.UserRecord = response.record;

        this.gs.InitLogin();

        setTimeout(() => {
          this.router.navigate(['login2'], { replaceUrl: true });
        });

      }, error => {
        this.loading = false;
        this.errorMessage = error.error.error_description;
        alert(this.errorMessage);
      });
  }

  async loadMenu() {
    await this.gs.LoadMenu();
    this.gs.IsAuthenticated = true;
  }

  test() {
    // this function will be called when login button pressed
  }

}
