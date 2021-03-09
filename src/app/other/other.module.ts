
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { OtherRoutingModule } from './other-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { OthGeneralComponent } from './general/oth-general.component';
import { OthGeneralHeaderComponent } from './general/oth-general-header.component';

import { OthGeneralEditComponent } from './general/edit/oth-general-edit.component';
import { OthTrackingPageComponent } from './trackingpage/oth-trackingpage.component';

import { MessengerSlipEditComponent } from './messengerslip/edit/messengerslip-edit.component';

import { MessengerSlipListComponent } from '../other/messengerslip/messengerslip-list.component';
import { MessengerSlipHeaderComponent } from '../other/messengerslip/messengerslip-header.component';
import { MessengerSlipComponent } from '../other/messengerslip/messengerslip.component';

import {ApprovedPageEditComponent } from './approvedpage/edit/approvedpage-edit.component';
import {ApprovedPageListComponent } from './approvedpage/approvedpage-list.component';
import { ApprovedPageHeaderComponent } from '../other/approvedpage/approvedpage-header.component';
import { ApprovedPageComponent } from '../other/approvedpage/approvedpage.component';

import { DeliveryOrderHeaderComponent } from '../other/deliveryorder/deliveryorder-header.component';
import { DeliveryOrderComponent } from '../other/deliveryorder/deliveryorder.component';
import { DeliveryOrderListComponent } from '../other/deliveryorder/deliveryorder-list.component';
import { DeliveryOrderEditComponent } from './deliveryorder/edit/deliveryorder-edit.component';

import { OthGeneralExpenseComponent } from './generalexpense/oth-generalexpense.component';
import { OthGeneralExpenseHeaderComponent } from './generalexpense/oth-generalexpense-header.component';
import { OthGeneralExpenseEditComponent } from './generalexpense/edit/oth-generalexpense-edit.component';

import { LockUnlockComponent } from './lockunlock/lockunlock.component';
import { LockUnlockHeaderComponent } from './lockunlock/lockunlock-header.component';

import { AlertLogPageComponent } from './alertlogpage/alertlogpage.component';
import { AlertLogPageHeaderComponent } from './alertlogpage/alertlogpage-header.component';
import { OblReleaseComponent } from './oblrelease/oblrelease.component';
import { OblReleaseEditComponent } from './oblrelease/oblrelease-edit.component';
import { OblReleaseHeaderComponent } from './oblrelease/oblrelease-header.component';
import { MblUsageComponent } from './mblusage/mblusage.component';
import { MblUsageHeaderComponent } from './mblusage/mblusage-header.component';
import { MlbUsageEditComponent } from './mblusage/mblusage-edit.component';
import { GenFileUploadComponent } from './genfileupload/genfileupload.component';
import { GenFileUploadHeaderComponent } from './genfileupload/genfileupload-header.component';
import { GenFileUploadEditComponent } from './genfileupload/genfileupload-edit.component';

import {  PayrollDetComponent } from './payrolldet/payrolldet.component';
import { PayrollDetEditComponent } from './payrolldet/payrolldet-edit.component';
import { PayrollDetHeaderComponent } from './payrolldet/payrolldet-header.component';

@NgModule({
  declarations: [
    OthGeneralComponent,
    OthGeneralHeaderComponent,
    OthGeneralEditComponent,
    OthTrackingPageComponent,
    MessengerSlipEditComponent,
    MessengerSlipListComponent,
    MessengerSlipHeaderComponent,
    MessengerSlipComponent,
    ApprovedPageEditComponent,
    ApprovedPageListComponent,
    ApprovedPageHeaderComponent,
    ApprovedPageComponent,
    DeliveryOrderHeaderComponent,
    DeliveryOrderComponent,
    DeliveryOrderListComponent,
    DeliveryOrderEditComponent,
    OthGeneralExpenseComponent,
    OthGeneralExpenseHeaderComponent,
    OthGeneralExpenseEditComponent,
    LockUnlockComponent,
    LockUnlockHeaderComponent,
    AlertLogPageComponent,
    AlertLogPageHeaderComponent,
    OblReleaseComponent,
    OblReleaseEditComponent,
    OblReleaseHeaderComponent,
    MblUsageComponent,
    MblUsageHeaderComponent,
    MlbUsageEditComponent,
    GenFileUploadComponent,
    GenFileUploadHeaderComponent,
    GenFileUploadEditComponent,
    PayrollDetComponent,
    PayrollDetHeaderComponent,
    PayrollDetEditComponent
  ],
  imports: [
    SharedModule,    
    OtherRoutingModule
  ]
})
export class OtherModule { }
