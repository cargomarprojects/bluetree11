import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AirImportRoutingModule } from './airimport-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AirImpMasterComponent } from './master/airimp-master.component';
import { AirImpMasterHeaderComponent } from './master/airimp-master-header.component';
import { AirImpMasterEditComponent } from './master/edit/airimp-master-edit.component';
import { AirImpHouseComponent } from './house/airimp-house.component';
import { AirImpHouseHeaderComponent } from './house/airimp-house-header.component';
import { AirImpHouseEditComponent } from './house/edit/airimp-house-edit.component';
import { AirImpCargoPickupComponent } from './cargopickup/airimp-cargopickup.component';

@NgModule({
  declarations: [
    AirImpMasterComponent,
    AirImpMasterHeaderComponent,
    AirImpMasterEditComponent,
    AirImpHouseComponent,
    AirImpHouseHeaderComponent,
    AirImpHouseEditComponent,
    AirImpCargoPickupComponent
  ],
  imports: [
    SharedModule,    
    AirImportRoutingModule
  ]
})
export class AirImportModule { }
