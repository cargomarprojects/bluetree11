import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class UsAccountReportService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  BankEnquiry(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBankEnquiryRpt/BankEnquiry", SearchData, this.gs.headerparam2('authorized'));
  }

  BankStmt(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBankStmtRpt/BankStmt", SearchData, this.gs.headerparam2('authorized'));
  }

  BankBalance(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBankBalRpt/BankBalance", SearchData, this.gs.headerparam2('authorized'));
  }

  BankList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBankBalRpt/BankList", SearchData, this.gs.headerparam2('authorized'));
  }

  AgingReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccAgingRpt/AgingReport", SearchData, this.gs.headerparam2('authorized'));
  }

  CustStmt(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccCustStmtRpt/CustStmt", SearchData, this.gs.headerparam2('authorized'));
  }

  DailyTransaction(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccDayBookRpt/DailyTransaction", SearchData, this.gs.headerparam2('authorized'));
  }

  LedgerReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccLedgerRpt/LedgerReport", SearchData, this.gs.headerparam2('authorized'));
  }
  LedgerAllReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccLedgerRpt/LedgerAllReport", SearchData, this.gs.headerparam2('authorized'));
  }

  
  TrialBalance(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccTrialBalRpt/TrialBalance", SearchData, this.gs.headerparam2('authorized'));
  }

  PandLReport(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccPandLRpt/PandLReport", SearchData, this.gs.headerparam2('authorized'));
  }

  UpdatePandL(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccPandLRpt/UpdatePandL", SearchData, this.gs.headerparam2('authorized'));
  }

  BalanceSheet(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccBalSheetRpt/BalanceSheet", SearchData, this.gs.headerparam2('authorized'));
  }

  InvoiceCustomer(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccInvCustUpdate/InvoiceCustomer", SearchData, this.gs.headerparam2('authorized'));
  }

  UpdateBillingCustomer(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccInvCustUpdate/UpdateBillingCustomer", SearchData, this.gs.headerparam2('authorized'));
  }

}


