import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AiDocsComponent } from './aidocs/aidocs.component';

const routes: Routes = [
  { path : 'AiDocsPage', component : AiDocsComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiRoutingModule { }