import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AiRoutingModule } from './ai-routing.module';

import { AiDocsComponent } from './aidocs/aidocs.component';


@NgModule({
  declarations: [
    AiDocsComponent
  ],
  imports: [
    SharedModule,    
    AiRoutingModule
  ]
})
export class AiModule { }
