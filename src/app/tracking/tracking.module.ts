import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TrackingRoutingModule } from './tracking-routing.module';

import { ShipmentHeaderComponent } from './shipment/shipment-header.component';
import { ShipmentComponent } from './shipment/shipment.component';

@NgModule({
  declarations: [
    ShipmentHeaderComponent,
    ShipmentComponent
  ],
  imports: [
    SharedModule,    
    TrackingRoutingModule
  ]
})
export class TrackingModule { }
