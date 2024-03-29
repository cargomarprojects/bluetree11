import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MasterRoutingModule } from './master-routing.module';

import { ParamReducer } from './store/param/param-page.reducer';
import { ParamEffects } from './store/param/param-page.effects';

import { ParamDetReducer } from './store/paramdet/paramdet-page.reducer';
import { ParamDetEffects } from './store/paramdet/paramdet-page.effects';

import { ParamPageComponent } from './param/param-page.component';
import { ParamHeaderComponent } from './param/param-header.component';
import { ParamEditComponent } from './param/param-edit.component';

import { ParamDetPageComponent } from './paramdet/paramdet-page.component';
import { ParamDetHeaderComponent } from './paramdet/paramdet-header.component';
import { ParamDetEditComponent } from './paramdet/paramdet-edit.component';
import { PartyHeaderComponent } from './party/party-header.component';
import { PartyComponent } from './party/party.component';
import { PartyEditComponent } from './party/edit/party-edit.component';
import { DeliveryAddrComponent } from './deliveryaddr/deliveryaddr.component';
import { PartyLoginComponent } from './partylogin/partylogin.component';
import { PartyAddrListComponent } from './partyaddr/partyaddr-list.component';
import { PartyAddrEditComponent } from './partyaddr/partyaddr-edit.component';
import { BankInfoComponent } from './bankinfo/bankinfo.component';
import { PartyParentEditComponent } from './party/edit/party-parent-edit.component';
import { VendorHeaderComponent } from './vendor/vendor-header.component';
import { VendorComponent } from './vendor/vendor.component';

import { PayrollMasterComponent } from './payrollmaster/payrollmaster.component';
import { PayrollMasterHeaderComponent } from './payrollmaster/payrollmaster-header.component';
import { PayrollMasterEditComponent } from './payrollmaster/payrollmaster-edit.component';
import { CompSettingsComponent } from './comp-settings/compsettings.component';
import { GlobalSettingsComponent } from './global-settings/globalsettings.component';
import { BranchSettingsComponent } from './branch-settings/branchsettings.component';
import { FormatPageComponent } from './formatpage/formatpage.component';
import { FormatPageHeaderComponent } from './formatpage/formatpage-header.component';
import { FormatPageDetComponent } from './formatpage/formatpagedet.component';
import { EhblComponent } from './ehbl/ehbl.component';
import { EhblReqComponent } from './ehbl/ehbl-req.component';
import { BulkmailComponent } from './bulkmail/bulkmail.component';

@NgModule({
  declarations: [
    ParamPageComponent,
    ParamHeaderComponent,
    ParamEditComponent,
    ParamDetPageComponent,
    ParamDetHeaderComponent,
    ParamDetEditComponent,   
    PartyHeaderComponent,
    PartyComponent,
    PartyEditComponent,
    DeliveryAddrComponent,
    PartyLoginComponent,
    PartyAddrListComponent,
    PartyAddrEditComponent,
    BankInfoComponent,
    PartyParentEditComponent,
    VendorHeaderComponent,
    VendorComponent,
    PayrollMasterComponent,
    PayrollMasterHeaderComponent,
    PayrollMasterEditComponent,
    CompSettingsComponent,
    GlobalSettingsComponent,
    BranchSettingsComponent,
    FormatPageComponent,
    FormatPageHeaderComponent,
    FormatPageDetComponent,
    EhblComponent,
    EhblReqComponent,
    BulkmailComponent
  ],
  imports: [
    SharedModule,
    MasterRoutingModule,
    StoreModule.forFeature('param', ParamReducer ),
    StoreModule.forFeature('paramdet', ParamDetReducer ),
    EffectsModule.forFeature([ParamEffects, ParamDetEffects])
    
  ]
})
export class MasterModule { }
