
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  Login(username: string, password: string, company_code: string) {
    var body = 'grant_type=' + 'password' + '&username=' + username + '&password=' + password;
    return this.http2.post<any>(this.gs.baseUrl + "/Token", body, this.gs.headerparam2('login', company_code));
  }

  LoadCompany(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Auth/CompanyList", SearchData, this.gs.headerparam2('anonymous'));
  }

  Login1(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Auth/Login1", SearchData, this.gs.headerparam2('anonymous'));
  }

  LovList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Auth/LovList', SearchData, this.gs.headerparam2('authorized'));
  }

  LoadCompanyYearList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Auth/CompanyYearList", SearchData, this.gs.headerparam2('anonymous'));
  }


  LoadSettings(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Auth/LoadSettings", SearchData, this.gs.headerparam2('anonymous'));
  }
  LoadMenu(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Auth/LoadMenu", SearchData, this.gs.headerparam2('authorized'));
  }




  Logout() {
    this.gs.IsLoginSuccess = false;
    this.gs.IsAuthenticated = false;
    this.gs.Access_Token = '';
    this.Logout2(this.gs.appid);
    this.gs.GenerateAppID();
  }



  LoadBranch(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Admin/User/LoadBranch", SearchData, this.gs.headerparam2('authorized'));
  }
  LoadYear(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Admin/User/LoadYear", SearchData, this.gs.headerparam2('authorized'));
  }

  Logout2(_appid:string) {
    var SearchData = this.gs.UserInfo;
    SearchData.company_pkid = this.gs.company_pkid;
    SearchData.company_code = this.gs.company_code;
    SearchData.company_name = this.gs.company_name;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.user_pkid = this.gs.user_pkid;
    SearchData.user_code = this.gs.user_code;
    SearchData.appid = _appid;
    this.PageLogout(SearchData)
      .subscribe(response => {

      }, error => {
        alert(this.gs.getError(error));
      });
  }

  PageLogout(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Auth/Logout", SearchData, this.gs.headerparam2('authorized'));
  }

  SaveActiveUser(_isActive:string) {
    var SearchData = this.gs.UserInfo;
    SearchData.user_pkid = this.gs.user_pkid;
    SearchData.appid = this.gs.appid;
    SearchData.isactive = _isActive;
    this.ActiveUser(SearchData)
      .subscribe(response => {

      }, error => {
      });
  }

  ActiveUser(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Auth/ActiveUser", SearchData, this.gs.headerparam2('authorized'));
  }

}


