import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirImpMasterComponent } from './master/airimp-master.component';
import { AirImpMasterEditComponent } from './master/edit/airimp-master-edit.component';
import { AirImpHouseComponent } from './house/airimp-house.component';
import { AirImpHouseEditComponent } from './house/edit/airimp-house-edit.component';
import { AirImpCargoPickupComponent } from './cargopickup/airimp-cargopickup.component';


const routes: Routes = [
  { path : 'AirImpMasterPage', component : AirImpMasterComponent },
  { path : 'AirImpMasterEditPage', component : AirImpMasterEditComponent },
  { path : 'AirImpHousePage', component : AirImpHouseComponent },
  { path : 'AirImpHouseEditPage', component : AirImpHouseEditComponent },
  { path : 'AirCargoPickupPage', component : AirImpCargoPickupComponent }  ,
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirImportRoutingModule { }