import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BusinessRoutingModule } from './business-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PaymentReqComponent } from './paymentreq/paymentreq.component';
import { FollowupComponent } from './followup/followup.component';
import { XmlRemarksComponent } from './xmlremarks/xmlremarks.component';
import { LogBookComponent } from './logbook/logbook.component';

@NgModule({
  declarations: [
    PaymentReqComponent,
    FollowupComponent,
    XmlRemarksComponent,
    LogBookComponent
  ],
  imports: [
    SharedModule,    
    BusinessRoutingModule
  ] ,
  exports: [
    PaymentReqComponent,
    FollowupComponent,
    XmlRemarksComponent,
    LogBookComponent
  ]
})
export class BusinessModule { }
