import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SeaExportRoutingModule } from './seaexport-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SeaexpMasterComponent } from './master/seaexp-master.component';
import { SeaExpMasterHeaderComponent } from './master/seaexp-master-header.component';
import { SeaexpMasterEditComponent } from './master/edit/seaexp-master-edit.component';
import { BookingComponent } from './booking/booking.component';
import { MblPageComponent } from './mblpage/mblpage.component';
import { DockPageComponent } from './dockpage/dockpage.component';
import { HousePageComponent } from './housepage/edit/housepage.component';
import { HousePageHeaderComponent } from './housepage/housepage-header.component';
import { HousePageListComponent } from './housepage/housepage-list.component';
import { CopyExpCntrPageComponent } from './copyexpcntrpage/copyexpcntrpage.component';
import { CertOrgPageComponent } from './certorgpage/certorgpage.component';

@NgModule({
  declarations: [
    SeaexpMasterComponent,
    SeaExpMasterHeaderComponent,
    SeaexpMasterEditComponent,
    BookingComponent,
    MblPageComponent,
    DockPageComponent,
    HousePageComponent,
    HousePageHeaderComponent,
    HousePageListComponent,
    CopyExpCntrPageComponent,
    CertOrgPageComponent
  ],
  imports: [
    SharedModule,    
    SeaExportRoutingModule
  ]
})
export class SeaExportModule { }
