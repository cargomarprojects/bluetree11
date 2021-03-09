import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({
  providedIn : 'root'
})
export class ReportService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    InvoiceList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/InvoiceList", SearchData, this.gs.headerparam2('authorized'));
    }

    ShipmentHandledReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/ShipmentHandledReport", SearchData, this.gs.headerparam2('authorized'));
    }

    TeuReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/TeuReport", SearchData, this.gs.headerparam2('authorized'));
    }

    TonReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/TonnageReport", SearchData, this.gs.headerparam2('authorized'));
    }

    ProfitReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/ProfitReport", SearchData, this.gs.headerparam2('authorized'));
    }
    
    StageList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/StageList", SearchData, this.gs.headerparam2('authorized'));
    }
    ProfitReportHouse(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/ProfitReportHouse", SearchData, this.gs.headerparam2('authorized'));
    }

    ShipmentLabelReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/ShipmentLabelReport", SearchData, this.gs.headerparam2('authorized'));
    }


    ConsigneeShipmentReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/ConsigneeShipmentReport", SearchData, this.gs.headerparam2('authorized'));
    }

    TopCustomerReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/TopCustomerReport", SearchData, this.gs.headerparam2('authorized'));
    }

    InvoiceIssueReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/InvoiceIssueReport", SearchData, this.gs.headerparam2('authorized'));
    }

    ItShipmentReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/ItShipmentReport", SearchData, this.gs.headerparam2('authorized'));
    }

    ShipmentCloseReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Other/Report/ShipmentCloseReport", SearchData, this.gs.headerparam2('authorized'));
    }

    ShipmentLogReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Other/Report/ShipmentLogReport", SearchData, this.gs.headerparam2('authorized'));
    }

    PayReqReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Other/Report/PayReqReport", SearchData, this.gs.headerparam2('authorized'));
    }
    PayReqUpdate(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Other/Report/PayReqUpdate", SearchData, this.gs.headerparam2('authorized'));
    }
    PayReqUploadHouseList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Other/Report/PayReqUploadHouseList", SearchData, this.gs.headerparam2('authorized'));
    }
    PayReqUploadInvoiceList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Other/Report/PayReqUploadInvoiceList", SearchData, this.gs.headerparam2('authorized'));
    }
    PayReqArApList(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/UsAccRptArApList/PayReqArApList", SearchData, this.gs.headerparam2('authorized'));
    }
    PayDueReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Other/Report/PayDueReport", SearchData, this.gs.headerparam2('authorized'));
    }
    AgentShipmentReport(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + "/api/Report/AgentShipmentReport", SearchData, this.gs.headerparam2('authorized'));
    }

}


