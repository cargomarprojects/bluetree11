import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShipmentComponent } from './shipment/shipment.component';

const routes: Routes = [
  { path : 'ShipmentList', component : ShipmentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { }
