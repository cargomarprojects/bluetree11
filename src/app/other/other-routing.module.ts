import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OthGeneralComponent } from './general/oth-general.component';
import { OthGeneralEditComponent } from './general/edit/oth-general-edit.component';
import { OthTrackingPageComponent } from './trackingpage/oth-trackingpage.component';
import { MessengerSlipComponent } from './messengerslip/messengerslip.component';
import { MessengerSlipEditComponent } from './messengerslip/edit/messengerslip-edit.component';
import { MessengerSlipListComponent } from '../other/messengerslip/messengerslip-list.component';

import {ApprovedPageEditComponent } from './approvedpage/edit/approvedpage-edit.component';
import {ApprovedPageListComponent } from './approvedpage/approvedpage-list.component';
import { ApprovedPageComponent } from '../other/approvedpage/approvedpage.component';
import { DeliveryOrderComponent } from '../other/deliveryorder/deliveryorder.component';
import { DeliveryOrderListComponent } from '../other/deliveryorder/deliveryorder-list.component';
import { DeliveryOrderEditComponent } from './deliveryorder/edit/deliveryorder-edit.component';
import { OthGeneralExpenseComponent } from './generalexpense/oth-generalexpense.component';
import { OthGeneralExpenseEditComponent } from './generalexpense/edit/oth-generalexpense-edit.component';
import { LockUnlockComponent } from './lockunlock/lockunlock.component';
import { AlertLogPageComponent } from './alertlogpage/alertlogpage.component';
import { OblReleaseComponent } from './oblrelease/oblrelease.component';
import { OblReleaseEditComponent } from './oblrelease/oblrelease-edit.component';
import { MblUsageComponent } from './mblusage/mblusage.component';
import { MlbUsageEditComponent } from './mblusage/mblusage-edit.component';
import { GenFileUploadComponent } from './genfileupload/genfileupload.component';
import { GenFileUploadEditComponent } from './genfileupload/genfileupload-edit.component';
import {  PayrollDetComponent } from './payrolldet/payrolldet.component';
import { PayrollDetEditComponent } from './payrolldet/payrolldet-edit.component';

const routes: Routes = [
  { path : 'GeneralPage', component : OthGeneralComponent },
  { path : 'OthGeneralEditPage', component : OthGeneralEditComponent },
  { path : 'TrackingPage', component : OthTrackingPageComponent },
  { path : 'MessengerSlip', component : MessengerSlipComponent },
  { path : 'MessengerSlipEdit', component : MessengerSlipEditComponent },
  { path : 'MessengerSlipList', component : MessengerSlipListComponent },
  { path : 'ApprovedPageEdit', component : ApprovedPageEditComponent },
  { path : 'ApprovedPageList', component : ApprovedPageListComponent },
  { path : 'ApprovedPage', component : ApprovedPageComponent },
  { path : 'DeliveryOrderPage', component : DeliveryOrderComponent },
  { path : 'DeliveryOrderList', component : DeliveryOrderListComponent },
  { path : 'DeliveryOrderEdit', component : DeliveryOrderEditComponent },
  { path : 'GeneralExpensePage', component : OthGeneralExpenseComponent },
  { path : 'OthGeneralExpenseEditPage', component : OthGeneralExpenseEditComponent },
  { path : 'LockUnlockPage', component : LockUnlockComponent },
  { path : 'AlertLogPage', component : AlertLogPageComponent },
  { path : 'OBLReleasedPage', component : OblReleaseComponent },
  { path : 'OBLReleasedEditPage', component : OblReleaseEditComponent },
  { path : 'OBLMBLUsagePage', component : MblUsageComponent },
  { path : 'MblUsageEditPage', component : MlbUsageEditComponent },
  { path : 'GeneralFileUploadPage', component : GenFileUploadComponent },
  { path : 'GeneralFileUploadEditPage', component : GenFileUploadEditComponent  },
  { path : 'PayrollPage', component : PayrollDetComponent  },
  { path : 'PayrollEditPage', component : PayrollDetEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
