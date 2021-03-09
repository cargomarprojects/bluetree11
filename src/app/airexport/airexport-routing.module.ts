import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirExpMasterComponent } from './master/airexp-master.component';
import { AirExpMasterEditComponent } from './master/edit/airexp-master-edit.component';
import { AirExpHouseComponent } from './house/airexp-house.component';
import { AirExpHouseEditComponent } from './house/edit/airexp-house-edit.component';
import { MawbPageComponent } from './mawbpage/mawbpage.component';
import { ManifestPageComponent } from './manifestpage/manifestpage.component';

const routes: Routes = [
  { path : 'AirExpMasterPage', component : AirExpMasterComponent },
  { path : 'AirExpMasterEditPage', component : AirExpMasterEditComponent },
  { path : 'AirExpHousePage', component : AirExpHouseComponent },
  { path : 'AirExpHouseEditPage', component : AirExpHouseEditComponent },
  { path : 'MawbPage', component : MawbPageComponent },
  { path : 'ManifestPage', component : ManifestPageComponent }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirExportRoutingModule { }