import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { TrackingRoutingModule } from './tracking-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,    
    TrackingRoutingModule
  ]
})
export class TrackingModule { }
