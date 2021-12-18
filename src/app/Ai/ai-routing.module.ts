import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { aidocsEditComponent } from './aidocs/aidocs-edit.component';
import { aidocsComponent } from './aidocs/aidocs.component';


const routes: Routes = [
  {path:'AiDocsPage', component : aidocsComponent },
  {path:'AiDocsEditPage', component : aidocsEditComponent } ,  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiRoutingModule { }