import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WhInwardComponent } from './inward/wh-inward.component';
import { WhInwardHeaderComponent } from './inward/wh-inward-header.component';
import { WhInwardEditComponent } from './inward/edit/wh-inward-edit.component';


@NgModule({
  declarations: [
    WhInwardComponent,
    WhInwardHeaderComponent,
    WhInwardEditComponent,
  ],
  imports: [
    SharedModule,
    WarehouseRoutingModule,
  ]
})
export class WarehouseModule { }
