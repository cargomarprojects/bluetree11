import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { USAccountsRoutingModule } from './usaccounts-routing.module';

import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/edit/invoice-edit.component';
import { ProfitReportComponent } from './profitreport/profitreport.component';
import { AcctmComponent } from './acctm/acctm.component';
import { AcctmHeaderComponent } from './acctm/acctm-header.component';
import { AcctmEditComponent } from './acctm/acctm-edit.component';
import { AcgroupComponent } from './acgroupm/acgroup.component';
import { AcgroupHeaderComponent } from './acgroupm/acgroup-header.component';
import { AcgroupEditComponent } from './acgroupm/acgroup-edit.component';
import { BudgetComponent } from './budget/budget.component';
import { AcopenComponent } from './acopening/acopen.component';
import { AcopenHeaderComponent } from './acopening/acopen-header.component';
import { AcopenEditComponent } from './acopening/acopen-edit.component';
import { FundTransferComponent } from './fundtransfer/fundtransfer.component';
import { FundTransferHeaderComponent } from './fundtransfer/fundtransfer-header.component';
import { FundTransferEditComponent } from './fundtransfer/fundtransfer-edit.component';
import { VoidCheckComponent } from './voidcheck/voidcheck.component';
import { VoidCheckHeaderComponent } from './voidcheck/voidcheck-header.component';
import { VoidCheckEditComponent } from './voidcheck/voidcheck-edit.component';
import { DepositComponent } from './deposit/deposit.component';
import { DepositEditComponent } from './deposit/deposit-edit.component';
import { DepositHeaderComponent } from './deposit/deposit-header.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentHeaderComponent } from './payment/payment-header.component';
import { PaymentEditComponent } from './payment/payment-edit.component';
import { PayFinalComponent } from './payfinal/payfinal.component';
import { AccSettingsComponent } from './accsettings/accsettings.component';
import { AccSettingsEditComponent } from './accsettings/accsettings-edit.component';
import { AccSettingsHeaderComponent } from './accsettings/accsettings-header.component';


@NgModule({
  declarations: [
  InvoiceComponent,
  InvoiceEditComponent,
  ProfitReportComponent,
  AcctmComponent,
  AcctmHeaderComponent,
  AcctmEditComponent,
  AcgroupComponent,
  AcgroupHeaderComponent,
  AcgroupEditComponent,
  BudgetComponent,
  AcopenComponent,
  AcopenHeaderComponent,
  AcopenEditComponent,
  FundTransferComponent,
  FundTransferHeaderComponent,
  FundTransferEditComponent,
  VoidCheckComponent,
  VoidCheckHeaderComponent,
  VoidCheckEditComponent,
  DepositComponent,
  DepositEditComponent,
  DepositHeaderComponent,
  PaymentComponent,
  PaymentHeaderComponent,
  PaymentEditComponent,
  PayFinalComponent,
  AccSettingsComponent,
  AccSettingsEditComponent,
  AccSettingsHeaderComponent
  

],
  imports: [
    SharedModule,
    USAccountsRoutingModule
  ]
})
export class USAccountsModule { }
