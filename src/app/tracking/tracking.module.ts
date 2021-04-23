import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TrackingRoutingModule } from './tracking-routing.module';

import { ShipmentHeaderComponent } from './shipment/shipment-header.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { MasterComponentRecords } from './shipment/master/master.component';

@NgModule({
  declarations: [
    ShipmentHeaderComponent,
    ShipmentComponent,
    MasterComponentRecords
  ],
  imports: [
    SharedModule,    
    TrackingRoutingModule
  ]
})
export class TrackingModule { }
