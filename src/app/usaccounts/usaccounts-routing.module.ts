import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/edit/invoice-edit.component';
import { ProfitReportComponent } from './profitreport/profitreport.component';
import { AcctmComponent } from './acctm/acctm.component';
import { AcctmEditComponent } from './acctm/acctm-edit.component';
import { AcgroupComponent } from './acgroupm/acgroup.component';
import { AcgroupEditComponent } from './acgroupm/acgroup-edit.component';
import { BudgetComponent } from './budget/budget.component';
import { AcopenComponent } from './acopening/acopen.component';
import { AcopenEditComponent } from './acopening/acopen-edit.component';
import { FundTransferComponent } from './fundtransfer/fundtransfer.component';
import { FundTransferEditComponent } from './fundtransfer/fundtransfer-edit.component';
import { VoidCheckEditComponent } from './voidcheck/voidcheck-edit.component';
import { VoidCheckComponent } from './voidcheck/voidcheck.component';
import { DepositComponent } from './deposit/deposit.component';
import { DepositEditComponent } from './deposit/deposit-edit.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentEditComponent } from './payment/payment-edit.component';
import { PayFinalComponent } from './payfinal/payfinal.component';
import { AccSettingsComponent } from './accsettings/accsettings.component';
import { AccSettingsEditComponent } from './accsettings/accsettings-edit.component';


const routes: Routes = [
  { path : 'InvoicePage', component : InvoiceComponent },
  { path : 'InvoiceEditPage', component : InvoiceEditComponent },
  { path : 'ProfitReportPage', component : ProfitReportComponent },
  { path : 'AcctmPage', component : AcctmComponent },
  { path : 'AcctmEditPage', component : AcctmEditComponent },
  { path : 'AccGroupPage', component : AcgroupComponent },
  { path : 'AccGroupEditPage', component : AcgroupEditComponent },
  { path : 'AccBudgetPage', component : BudgetComponent },
  { path : 'OpeningPage', component : AcopenComponent },
  { path : 'OpenEditPage', component : AcopenEditComponent },
  { path : 'FundTransPage', component : FundTransferComponent },
  { path : 'FundTransEditPage', component : FundTransferEditComponent },
  { path : 'VoidCheckPage', component : VoidCheckComponent },
  { path : 'VoidCheckEditPage', component : VoidCheckEditComponent },
  { path : 'DepositPage', component : DepositComponent },
  { path : 'DepositEditPage', component : DepositEditComponent },
  { path : 'PaymentPage', component : PaymentComponent },
  { path : 'PaymentEditPage', component : PaymentEditComponent },
  { path : 'PayFinalPage', component : PayFinalComponent },

  { path : 'AccSettingsPage', component : AccSettingsComponent },
  { path : 'AccSettingsEditPage', component : AccSettingsEditComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class USAccountsRoutingModule { }
