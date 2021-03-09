import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsAccountsReportsRoutingModule } from './usaccounts-reports-routing.module';
import { StoreModule } from '@ngrx/store';

import { BankEnquiryReportComponent } from './bank-enquiry-report/bank-enquiry-report.component';
import { BankEnquiryReportReducer  } from './bank-enquiry-report/store/bank-enquiry-report.reducer';

import { BankStmtReportComponent } from './bank-stmt-report/bank-stmt-report.component';
import { BankStmtReportReducer  } from './bank-stmt-report/store/bank-stmt-report.reducer';

import { BankBalReportComponent } from './bank-bal-report/bank-bal-report.component';
import { BankBalReportReducer  } from './bank-bal-report/store/bank-bal-report.reducer';

import { AgingReportComponent } from './aging-report/aging-report.component';
import { AgingReportReducer  } from './aging-report/store/aging-report.reducer';

import { CustStmtReportComponent } from './cust-stmt-report/cust-stmt-report.component';
import { CustStmtReportReducer  } from './cust-stmt-report/store/cust-stmt-report.reducer';


import { PaySearchComponent } from './paysearch/paysearch.component';
import { PaySearchHeaderComponent } from './paysearch/paysearch-header.component';

import { DayBookReportComponent } from './day-book-report/day-book-report.component';
import { DayBookReportReducer  } from './day-book-report/store/day-book-report.reducer';

import { GenLedgerReportComponent } from './gen-ledger-report/gen-ledger-report.component';
import { GenLedgerReportReducer  } from './gen-ledger-report/store/gen-ledger-report.reducer';

import { TrialBalReportComponent } from './trial-bal-report/trial-bal-report.component';
import { TrialBalReportReducer  } from './trial-bal-report/store/trial-bal-report.reducer';

import { PandLReportComponent } from './pandl-report/pandl-report.component';
import { PandLReportReducer  } from './pandl-report/store/pandl-report.reducer';

import { BalSheetReportComponent } from './bal-sheet-report/bal-sheet-report.component';
import { BalSheetReportReducer  } from './bal-sheet-report/store/bal-sheet-report.reducer';
import { LedgerAllReportComponent } from './ledger-all-report/ledger-all-report.component';

import { InvCustReportComponent } from './inv-cust-report/inv-cust-report.component';
import { InvCustReportReducer  } from './inv-cust-report/store/inv-cust-report.reducer';

import { BankReconComponent } from './bankrecon/bankrecon.component';
import { BankReconHeaderComponent } from './bankrecon/bankrecon-header.component';

@NgModule({
    declarations :[
      BankEnquiryReportComponent,  
      BankStmtReportComponent,
      BankBalReportComponent,
      AgingReportComponent,
      CustStmtReportComponent,
      PaySearchComponent,
      PaySearchHeaderComponent,
      DayBookReportComponent,
      GenLedgerReportComponent,
      TrialBalReportComponent,
      PandLReportComponent,
      BalSheetReportComponent,
      LedgerAllReportComponent,
      InvCustReportComponent,
      BankReconComponent,
      BankReconHeaderComponent
  ],
  imports: [
    SharedModule,
    UsAccountsReportsRoutingModule,
    StoreModule.forFeature('BankEnquiryReport',BankEnquiryReportReducer ),    
    StoreModule.forFeature('BankStmtReport',BankStmtReportReducer ),    
    StoreModule.forFeature('BankBalReport',BankBalReportReducer ),    
    StoreModule.forFeature('AgingReport',AgingReportReducer ),    
    StoreModule.forFeature('CustStmtReport',CustStmtReportReducer ),  
    StoreModule.forFeature('DayBookReport',DayBookReportReducer ),    
    StoreModule.forFeature('GenLedgerReport',GenLedgerReportReducer ),      
    StoreModule.forFeature('TrialBalReport',TrialBalReportReducer ),      
    StoreModule.forFeature('PandLReport',PandLReportReducer ),      
    StoreModule.forFeature('BalSheetReport',BalSheetReportReducer ),      
    StoreModule.forFeature('InvCustReport',InvCustReportReducer ),      
  ],
  providers: [
  ]
})
export class UsAccountsReportsModule { }
