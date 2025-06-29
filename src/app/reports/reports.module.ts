import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { StoreModule } from '@ngrx/store';

import { ShipHandReportComponent } from './ship-hand-report/ship-hand-report.component';
import { TeuReportComponent } from './teu-report/teu-report.component';
import { TonReportComponent } from './ton-report/ton-report.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { ProfitReportHouseComponent } from './profit-report-house/profit-report-house.component';
import { ShipLabelReportComponent } from './ship-label-report/ship-label-report.component';
import { TopCustomerReportComponent } from './top-customer-report/top-customer-report.component';
import { ShipmentLogReportComponent } from './ship-log-report/ship-log-report.component';
import { ShipLogMasterUpdateComponent } from './ship-log-report/ship-log-master-update.component';

import { ShipHandReportReducer } from './ship-hand-report/store/ship-hand-report.reducer';
import { TeuReportReducer } from './teu-report/store/teu-report.reducer';
import { TonReportReducer } from './ton-report/store/ton-report.reducer';
import { ProfitReportReducer } from './profit-report/store/profit-report.reducer';
import { ProfitReportHouseReducer } from './profit-report-house/store/profit-report-house.reducer';
import { ShipLabelReportReducer } from './ship-label-report/store/ship-label-report.reducer';


import { TopCustomerReportReducer } from './top-customer-report/store/top-customer-report.reducer';
import { ConsShipReportReducer } from './cons-ship-report/store/cons-ship-report.reducer';
import { ConsShipReportComponent } from './cons-ship-report/cons-ship-report.component';
import { ShipmentLogReportReducer } from './ship-log-report/store/ship-log-report.reducer';
import { AgentShipReportReducer } from './agent-ship-report/store/agent-ship-report.reducer';
import { AgentShipReportComponent } from './agent-ship-report/agent-ship-report.component';

import { InvIssReportComponent } from './invoice-issue/inv-iss-report.component';
import { InvIssReportReducer } from './invoice-issue/store/inv-iss-report.reducer';
import { ItShipReportComponent } from './it-ship-report/it-ship-report.component';
import { ItShipReportReducer } from './it-ship-report/store/it-ship-report.reducer';
import { ShipCloseReportComponent } from './ship-closing/ship-close-report.component';
import { ShipCloseReportReducer } from './ship-closing/store/ship-close-report.reducer';
import { PayReqReportComponent } from './pay-req/pay-req-report.component';
import { PayReqReportReducer } from './pay-req/store/pay-req-report.reducer';
import { PayUploadReportComponent } from './pay-req/pay-upload-report.component';
import { PayDueReportComponent } from './pay-due/pay-due-report.component';
import { PayDueReportReducer } from './pay-due/store/pay-due-report.reducer';

import { GenSearchReportComponent } from './gen-search-report/gen-search-report.component';
import { GenSearchHeaderComponent } from './gen-search-report/gen-search-header.component';
import { NomReportComponent } from './nom-report/nom-report.component';
import { NomReportHeaderComponent} from './nom-report/nom-report-header.component';
import { LogRegisterHeaderComponent } from './log-register/logregister-header.component';
import { LogRegisterComponent } from './log-register/logregister.component';
import { CustReportHeaderComponent } from './cust-report/cust-report-header.component';
import { CustReportComponent } from './cust-report/cust-report.component';
import { DataEntryReportHeaderComponent } from './data-entry-report/data-entry-report-header.component';
import { DataEntryReportComponent } from './data-entry-report/data-entry-report.component';
import { UserActiveHeaderComponent } from './user-active/useractive-header.component';
import { UserActiveComponent } from './user-active/useractive.component';
import { UserActiveDetComponent } from './user-active/useractivedet.component';
import { UserActiveDetHeaderComponent } from './user-active/useractivedet-header.component';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';
import { InvoiceReportHeaderComponent} from './invoice-report/invoice-report-header.component';
import { EmailReportHeaderComponent } from './email-report/email-report-header.component';
import { EmailReportComponent } from './email-report/email-report.component';
import { DailyShipReportHeaderComponent } from './daily-ship-report/daily-ship-report-header.component';
import { DailyShipReportComponent } from './daily-ship-report/daily-ship-report.component';
import { DownloadReportHeaderComponent } from './download-report/download-report-header.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { InvoiceHistoryHeaderComponent } from './invoice-history/invoice-history-header.component';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';

@NgModule({
    declarations :[
    ShipHandReportComponent,
    TeuReportComponent,
    TonReportComponent,
    ProfitReportComponent,
    ProfitReportHouseComponent,
    ShipLabelReportComponent,
    ConsShipReportComponent,
    AgentShipReportComponent,
    TopCustomerReportComponent,
    ShipmentLogReportComponent,
    InvIssReportComponent,
    ItShipReportComponent,
    ShipCloseReportComponent,
    PayReqReportComponent,
    PayUploadReportComponent,
    PayDueReportComponent,
    GenSearchReportComponent,
    GenSearchHeaderComponent,
    NomReportComponent,
    NomReportHeaderComponent,
    LogRegisterHeaderComponent,
    LogRegisterComponent,
    CustReportHeaderComponent,
    CustReportComponent,
    DataEntryReportHeaderComponent,
    DataEntryReportComponent,
    ShipLogMasterUpdateComponent,
    UserActiveHeaderComponent,
    UserActiveComponent,
    UserActiveDetComponent,
    UserActiveDetHeaderComponent,
    InvoiceReportComponent,
    InvoiceReportHeaderComponent,
    EmailReportHeaderComponent,
    EmailReportComponent,
    DailyShipReportHeaderComponent,
    DailyShipReportComponent,
    DownloadReportHeaderComponent,
    DownloadReportComponent,
    InvoiceHistoryHeaderComponent,
    InvoiceHistoryComponent
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule,
    StoreModule.forFeature('ShipHandReport',ShipHandReportReducer ),    
    StoreModule.forFeature('TeuReport',TeuReportReducer ),        
    StoreModule.forFeature('TonReport',TonReportReducer ),        
    StoreModule.forFeature('ProfitReport',ProfitReportReducer ),        
    StoreModule.forFeature('ProfitReportHouse',ProfitReportHouseReducer ), 
    StoreModule.forFeature('ShipLabelReport',ShipLabelReportReducer ),
    StoreModule.forFeature('ConsShipReport',ConsShipReportReducer ),
    StoreModule.forFeature('AgentShipReport',AgentShipReportReducer ),
    StoreModule.forFeature('ShipLabelReport',ShipLabelReportReducer ),
    StoreModule.forFeature('TopCustomerReport',TopCustomerReportReducer ),   
    StoreModule.forFeature('ShipmentLogReport',ShipmentLogReportReducer ),
    StoreModule.forFeature('InvoiceIssueReport',InvIssReportReducer ),
    StoreModule.forFeature('ItShipReport',ItShipReportReducer),    
    StoreModule.forFeature('ShipCloseReport',ShipCloseReportReducer),    
    StoreModule.forFeature('PayReqReport',PayReqReportReducer),    
    StoreModule.forFeature('PayDueReport',PayDueReportReducer),    
    
  ],
  providers: [
  ]
})
export class ReportsModule { }
