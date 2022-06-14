import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WhInwardComponent } from './inward/wh-inward.component';
import { WhInwardHeaderComponent } from './inward/wh-inward-header.component';
import { WhInwardEditComponent } from './inward/edit/wh-inward-edit.component';
import { WhProductComponent } from './product/wh-product.component';
import { WhProductHeaderComponent } from './product/wh-product-header.component';
import { WhProductEditComponent } from './product/edit/wh-product-edit.component';
import { WhOutwardComponent } from './outward/wh-outward.component';
import { WhOutwardHeaderComponent } from './outward/wh-outward-header.component';
import { WhOutwardEditComponent } from './outward/edit/wh-outward-edit.component';
import { WhOutwardDetComponent } from './outward/edit/wh-outward-det.component';

@NgModule({
  declarations: [
    WhInwardComponent,
    WhInwardHeaderComponent,
    WhInwardEditComponent,
    WhProductComponent,
    WhProductHeaderComponent,
    WhProductEditComponent,
    WhOutwardComponent,
    WhOutwardHeaderComponent,
    WhOutwardEditComponent,
    WhOutwardDetComponent
  ],
  imports: [
    SharedModule,
    WarehouseRoutingModule,
  ]
})
export class WarehouseModule { }
