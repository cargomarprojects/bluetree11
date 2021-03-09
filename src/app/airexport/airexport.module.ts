import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AirExportRoutingModule } from './airexport-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AirExpMasterComponent } from './master/airexp-master.component';
import { AirExpMasterHeaderComponent } from './master/airexp-master-header.component';
import { AirExpMasterEditComponent } from './master/edit/airexp-master-edit.component';
import { AirExpHouseComponent } from './house/airexp-house.component';
import { AirExpHouseHeaderComponent } from './house/airexp-house-header.component';
import { AirExpHouseEditComponent } from './house/edit/airexp-house-edit.component';
import { MawbPageComponent } from './mawbpage/mawbpage.component';
import { ManifestPageComponent } from './manifestpage/manifestpage.component';

@NgModule({
  declarations: [
    AirExpMasterComponent,
    AirExpMasterHeaderComponent,
    AirExpMasterEditComponent,
    AirExpHouseComponent,
    AirExpHouseHeaderComponent,
    AirExpHouseEditComponent,
    MawbPageComponent,
    ManifestPageComponent
  ],
  imports: [
    SharedModule,    
    AirExportRoutingModule
  ]
})
export class AirExportModule { }
