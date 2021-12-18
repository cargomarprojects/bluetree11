import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AiRoutingModule } from './ai-routing.module';
import { aidocsEditComponent } from './aidocs/aidocs-edit.component';
import { aidocsHeaderComponent } from './aidocs/aidocs-header.component';
import { aidocsComponent } from './aidocs/aidocs.component';




@NgModule({
  declarations: [
    aidocsComponent,
    aidocsHeaderComponent,
    aidocsEditComponent

  ],
  imports: [
    SharedModule,    
    AiRoutingModule
  ]
})
export class AiModule { }
