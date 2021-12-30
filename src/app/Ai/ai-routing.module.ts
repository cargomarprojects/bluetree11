import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { aiformatEditComponent } from './aidata/aiformat-edit.component';
import { aiformatComponent } from './aidata/aiformat.component';
import { aidocsEditComponent } from './aidocs/aidocs-edit.component';
import { aidocsComponent } from './aidocs/aidocs.component';
import { aiverifyComponent } from './aiverifiy/aiverify.component';


const routes: Routes = [
  {path:'AiDocsPage', component : aidocsComponent },
  {path:'AiDocsEditPage', component : aidocsEditComponent } ,  
  {path:'AiFormatPage', component : aiformatComponent },
  {path:'AiFormatEditPage', component : aiformatEditComponent } ,    
  {path:'AiVerifyPage', component : aiverifyComponent },

  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiRoutingModule { }