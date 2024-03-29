import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamPageComponent } from './param/param-page.component';
import { ParamEditComponent } from './param/param-edit.component';

import { ParamDetPageComponent } from './paramdet/paramdet-page.component';
import { ParamDetEditComponent } from './paramdet/paramdet-edit.component';
import { PartyComponent } from './party/party.component';
import { PartyEditComponent } from './party/edit/party-edit.component';
import { DeliveryAddrComponent } from './deliveryaddr/deliveryaddr.component';
import { PartyLoginComponent } from './partylogin/partylogin.component';
import { PartyAddrListComponent } from './partyaddr/partyaddr-list.component';
import { PartyAddrEditComponent } from './partyaddr/partyaddr-edit.component';
import { BankInfoComponent } from './bankinfo/bankinfo.component';
import { PartyParentEditComponent } from './party/edit/party-parent-edit.component';
import { VendorComponent } from './vendor/vendor.component';
import { PayrollMasterComponent } from './payrollmaster/payrollmaster.component';
import { PayrollMasterEditComponent } from './payrollmaster/payrollmaster-edit.component';
import { CompSettingsComponent } from './comp-settings/compsettings.component';
import { GlobalSettingsComponent } from './global-settings/globalsettings.component';
import { BranchSettingsComponent } from './branch-settings/branchsettings.component';
import { FormatPageComponent } from './formatpage/formatpage.component';
import { EhblComponent } from './ehbl/ehbl.component';
import { EhblReqComponent } from './ehbl/ehbl-req.component';
import { BulkmailComponent } from './bulkmail/bulkmail.component';

const routes: Routes = [
  {path:'ParamPage', component: ParamPageComponent},
  {path:'ParamEdit', component: ParamEditComponent},
  {path:'ParamPageDet', component: ParamDetPageComponent},
  {path:'ParamPageDetEdit', component: ParamDetEditComponent},  
  {path:'PartyPage', component: PartyComponent},  
  {path:'PartyEditPage', component: PartyEditComponent},  
  {path:'DeliveryAddrPage', component: DeliveryAddrComponent},  
  {path:'PartyLoginPage', component: PartyLoginComponent},  
  {path:'PartyAddrPage', component: PartyAddrListComponent},  
  {path:'PartyAddrEditPage', component: PartyAddrEditComponent},  
  {path:'BankInfoPage', component: BankInfoComponent},  
  {path:'PartyParentEditPage', component: PartyParentEditComponent},  
  {path:'VendorListPage', component: VendorComponent},  
  {path:'PayrollPageView', component: PayrollMasterComponent}, 
  {path:'PayrollPageEditView', component: PayrollMasterEditComponent}, 
  {path:'CompSettingsPage', component: CompSettingsComponent}, 
  {path:'GlobalSettingsPage', component: GlobalSettingsComponent}, 
  {path:'SettingsPage', component: BranchSettingsComponent}, 
  {path:'FormatPage', component: FormatPageComponent},
  {path:'EhblPage', component: EhblComponent},  
  {path:'EhblReqPage', component: EhblReqComponent},
  {path:'BulkMailPage', component: BulkmailComponent},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
