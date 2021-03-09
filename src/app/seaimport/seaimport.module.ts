
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SeaImportRoutingModule } from './seaimport-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SeaImpMasterComponent } from './master/seaimp-master.component';
import { SeaImpMasterHeaderComponent } from './master/seaimp-master-header.component';

import { SeaImpMasterEditComponent } from './master/edit/seaimp-master-edit.component';
import { SeaImpHouseComponent } from './house/seaimp-house.component';
import { SeaImpHouseHeaderComponent } from './house/seaimp-house-header.component';
import { SeaImpHouseEditComponent } from './house/edit/seaimp-house-edit.component';
import { SeaImpUsCustomsHoldComponent } from './uscustomshold/seaimp-uscustomshold.component';
import { SeaImpCargoPickupComponent } from './cargopickup/seaimp-cargopickup.component';
import { SeaImpRiderPageComponent } from './riderpage/seaimp-riderpage.component';
import { DevanComponent } from './devan/devan.component';
import { CopyCntrPageComponent } from './copycntrpage/copycntrpage.component';

@NgModule({
  declarations: [
    SeaImpMasterComponent,
    SeaImpMasterHeaderComponent,
    SeaImpMasterEditComponent,
    SeaImpHouseComponent,
    SeaImpHouseHeaderComponent,
    SeaImpHouseEditComponent,
    SeaImpUsCustomsHoldComponent,
    SeaImpCargoPickupComponent,
    SeaImpRiderPageComponent,
    DevanComponent,
    CopyCntrPageComponent
  ],
  imports: [
    SharedModule,    
    SeaImportRoutingModule
  ]
})
export class SeaImportModule { }
