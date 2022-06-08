import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WhInwardComponent } from './inward/wh-inward.component';
import { WhInwardEditComponent } from './inward/edit/wh-inward-edit.component';

const routes: Routes = [
  { path: 'WhInwardPage', component: WhInwardComponent },
  { path: 'WhInwardEditPage', component: WhInwardEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
